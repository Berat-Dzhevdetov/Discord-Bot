const ytdl = require('ytdl-core');

module.exports = {
    async play(guild, song, message, client) {
        const songQueue = client.queue.get(guild.id);

        let eventForLeavingAfterTime;

        if (!song) {
            eventForLeavingAfterTime = setTimeout(() => {
                songQueue.voiceChannel.leave();
                queue.delete(guild.id);
            }, 10 * 1000 * 60);
            return;
        }

        const stream = ytdl(song.url, { filter: 'audioonly' });

        songQueue.connection.play(stream, { seek: 0 })
            .on('finish', async () => {
                songQueue.songs.shift();
                await this.play(guild, songQueue.songs[0], message, client);
            });

        return await message.channel.send(`🎵 Now playing **${song.title}**. Requested from **${message.author.username}**`);
    },
    async clear(serverQueue) {
        serverQueue.songs = [];
    },
    async stopCurrentSong(serverQueue){
        serverQueue.connection.dispatcher.destroy();
    },
    async setLeaveCountDown(songQueue, guild, miliseconds = 10 * 1000 * 60) {
        return setTimeout(() => {
            songQueue.voiceChannel.leave();
            queue.delete(guild.id);
        }, miliseconds);
    }
}