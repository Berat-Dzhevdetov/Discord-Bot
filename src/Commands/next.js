const Command = require("../Structures/Command");
const play = require('./play');

module.exports = new Command({
    name: "next",
    description: "If there is a song currenly playing it will skip it. If there is next song it will be automatically played.",
    permission: "CONNECT,SPEAK",

    async run(message, _, client) {
        if (!message.member.voice.channel)
            return message.channel.send("You need to be connected to channel.");

        const guild = message.guild;

        let serverQueue = client.queue.get(guild.id);

        if (!serverQueue || !serverQueue.connection.dispatcher)
            return message.channel.send("There is nothing to skip!");

        serverQueue.connection.dispatcher.end();

        return message.channel.send(":fast_forward: Skipped the song for you!");
    }
})