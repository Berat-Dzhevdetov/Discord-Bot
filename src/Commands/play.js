const Command = require("../Structures/Command");
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel } = require('@discordjs/voice');

const queue = new Map();

module.exports = new Command({
    name: "play",
    description: "Plays music from youtube if found.",
    permission: "CONNECT,SPEAK",
    async run(message, args, _) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel)
            return await message.channel.send('You need to be in a channel to execute this command!')

        const serverQueue = queue.get(message.guild.id);

        if (!args[1] || args[1].length <= 0)
            return await message.channel.send('Invalid search argument.');

        let requestedFrom = message.member.user.tag;

        let song = { requestedFrom };

        if (ytdl.validateURL(args[1])) {
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
                await message.channel.send(`There were no search results for '${videoQuery}'`);
        }

        if (!serverQueue) {
            const queueConstructor = {
                voiceChannel: voiceChannel,
                textChannel: message.channel,
                connection: null,
                songs: []
            }
            queue.set(message.guild.id, queueConstructor);

            queueConstructor.songs.push(song);

            try {
                let connection = await voiceChannel.join();
                queueConstructor.connection = connection;

                await play(message.guild, queueConstructor.songs[0], message);
            } catch (error) {
                queue.delete(message.guild.id);
                await message.channel.send(`There was a problem while trying to connect to the voice channel.`);
                console.log(error);
            }
        } else {
            serverQueue.songs.push(song);
            return await message.channel.send(`🎵 **${song.title}** was added to the queue.`);
        }
    }
})

async function play(guild, song, message) {
    const songQueue = queue.get(guild.id);

    let eventForLeavingAfterTime;

    if (!song) {
        eventForLeavingAfterTime = setTimeout(() => {
            songQueue.voiceChannel.leave();
            queue.delete(guild.id);
        }, 10 * 1000 * 60);
    }

    const stream = ytdl(song.url, { filter: 'audioonly' });

    songQueue.connection.play(stream, { seek: 0 })
        .on('finish', async () => {
            songQueue.song.shift();
            await play(guild, songQueue.songs[0],message)
        });

    return await message.channel.send(`🎵 Now playing **${song.title}**. Requested from **${song.requestedFrom}**`);
}