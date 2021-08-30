const Command = require("../Structures/Command");

module.exports = new Command({
    name: "pause",
    description: "Pauses the current playing sound.",
    permission: "CONNECT,SPEAK",

    async run(message, _, client) {
        const serverQueue = client.queue.get(message.guild.id);

		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused the music for you!');
		}
        
		return message.channel.send('There is nothing playing.');
    }
})