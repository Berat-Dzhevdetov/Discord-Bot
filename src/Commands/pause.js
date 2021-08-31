const Command = require("../Structures/Command");

module.exports = new Command({
    name: "pause",
    description: "Pauses the current playing sound.",
    permission: "CONNECT,SPEAK",

    async run(message, _, client) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel)
            return await message.channel.send('You need to be in a channel to execute this command!');
            
        const serverQueue = client.queue.get(message.guild.id);

        if (!serverQueue || !serverQueue.songs[0])
            return message.channel.send('There is nothing playing.');

        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send('⏸ Paused the music for you!');
    }
})