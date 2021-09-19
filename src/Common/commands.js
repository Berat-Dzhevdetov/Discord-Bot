const ytdl = require('ytdl-core');

module.exports = {
    async stopCurrentSong(serverQueue){
    },
    async setLeaveCountDown(songQueue, guild, miliseconds = 10 * 1000 * 60) {
        return setTimeout(() => {
            songQueue.voiceChannel.leave();
            queue.delete(guild.id);
        }, miliseconds);
    }
}