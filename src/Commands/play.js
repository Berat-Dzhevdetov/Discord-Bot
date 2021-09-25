const Command = require("../Structures/Command");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const YouTube = require('simple-youtube-api');
const { simpleYoutubeApiKey } = require('../Data/config.json');
const youtube = new YouTube(simpleYoutubeApiKey);

module.exports = new Command({
    name: "play",
    description: "Plays music from youtube if found.",
    permission: "CONNECT,SPEAK",
    async run(message, args, client) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel)
            return await message.channel.send('You need to be in a channel to execute this command!');

        let serverQueue = client.queue.get(message.guild.id);

        if (!args[1] || args[1].length <= 0)
            return await message.channel.send('Invalid search argument.');

        let song = {};

        if (isPlayList(args[1])) {
            try {
                const playlist = await youtube.getPlaylist(args[1].toString());

                const songsInPlaylist = await playlist.getVideos(25);

                let firstSongUrl = `https://www.youtube.com/watch?v=${songsInPlaylist[0].id}`;

                let songInfo = await ytdl.getInfo(firstSongUrl);

                song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };

                prepareForPlayMusic(serverQueue, message, voiceChannel, client, song);

                serverQueue = client.queue.get(message.guild.id);

                message.channel.send(`🎵 Now adding songs from playlist: **${playlist.title}**`);

                let songs = [];

                for(let i = 1; i < songsInPlaylist.length; i++) {
                    const currentSong = songsInPlaylist[i];

                    let currentSongUrl = `https://www.youtube.com/watch?v=${currentSong.id}`;

                    songInfo = await ytdl.getInfo(currentSongUrl);

                    song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };

                    songs.push(song);
                }
                
                prepareForPlayMusic(serverQueue, message, voiceChannel, client, songs);

                message.channel.send(`Added ${songsInPlaylist.length - 1} more songs from the playlist to the queue! 😊`);
            } catch (error) {
                await message.channel.send(error || "error");
            }
        }
        else if (ytdl.validateURL(args[1])) {
            const songInfo = await ytdl.getInfo(args[1]);

            song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
        } else {

            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
                return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
            }

            const videoQuery = args.slice(1).join(' ');

            const video = await videoFinder(videoQuery);
            if (video)
                song = { title: video.title, url: video.url };
            else
                return await message.channel.send(`There were no search results for '${videoQuery}'`);
        }

        await prepareForPlayMusic(serverQueue, message, voiceChannel, client, song);
    }
})

const play = async (guild, song, message, client) => {
    const songQueue = client.queue.get(guild.id);

    if (!song) {
        await client.setLeaveTimeOut(guild);
        return;
    }

    if (client.timeOutForLeaving) await client.destroyLeaveTimeOut()

    const stream = ytdl(song.url, { filter: 'audioonly' });

    songQueue.connection.play(stream, { seek: 0 })
        .on('finish', async () => {
            songQueue.songs.shift();
            await play(guild, songQueue.songs[0], message, client);
        });

    return await message.channel.send(`🎵 Now playing **${song.title}**. Requested from **${message.author.username}**`);
}

function isPlayList(arg) {
    return arg.toString().match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/);
}

async function prepareQueueConstructor(message, voiceChannel, client, song) {
    const queueConstructor = {
        voiceChannel: voiceChannel,
        textChannel: message.channel,
        connection: null,
        songs: []
    }
    client.queue.set(message.guild.id, queueConstructor);

    if (Array.isArray(song))
        foreachSongsForQueueContructor(song, queueConstructor);
    else
        queueConstructor.songs.push(song);

    let connection = await voiceChannel.join();
    queueConstructor.connection = connection;

    return queueConstructor;
}

function foreachSongsForQueueContructor(songs, queueConstructor){
    for (let index = 0; index < songs.length; index++) {
        const currentSong = songs[index];
        queueConstructor.songs.push(currentSong);
    }
}

function foreachSongsForServerQueue(songs, message, client){
    let serverQueue = client.queue.get(message.guild.id);

    for (let index = 0; index < songs.length; index++) {
        const currentSong = songs[index];
        serverQueue.songs.push(currentSong);
    }
}

async function prepareForPlayMusic(serverQueue, message, voiceChannel, client, song){
    if (!serverQueue || !serverQueue.connection.dispatcher) {
        try {
            const queueConstructor = await prepareQueueConstructor(message, voiceChannel, client, song);

            await play(message.guild, queueConstructor.songs[0], message, client);
        } catch (error) {
            client.queue.delete(message.guild.id);
            await message.channel.send(`There was a problem while trying to connect to the voice channel.`);
            console.log(error);
        }
    } else if (Array.isArray(song)) {
        foreachSongsForServerQueue(song, message, client);
    } else if(serverQueue && serverQueue.connection.dispatcher) {
        serverQueue.songs.push(song);
        return await message.channel.send(`🎵 **${song.title}** was added to the queue from **${message.author.username}**.`);
    } 
}