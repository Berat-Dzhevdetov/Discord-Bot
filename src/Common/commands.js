module.exports = {
    async stopCurrentSong(serverQueue){
        serverQueue.connection.dispatcher.destroy();
    }
}