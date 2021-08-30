const Command = require("../Structures/Command");

module.exports = new Command({
    name: "resume",
    description: "Resume the current playing sound.",
    permission: "CONNECT,SPEAK",

    async run(message, _, client) {
        const serverQueue = client.queue.get(message.guild.id);

		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed the music for you!');
		}

		return message.channel.send('There is nothing playing.');
    }
})