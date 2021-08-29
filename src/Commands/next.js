const Command = require("../Structures/Command");
const play = require('../Common/play');

module.exports = new Command({
    name: "next",
    description: "Shows the ping of the bot.",
    permission: "CONNECT,SPEAK",

    async run(message, _, client) {
        if (!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first");

        const guild = message.guild;
        
        let serverQueue = client.queue.get(guild.id);

        if (!serverQueue)
            return message.channel.send("There is nothing to skip!");

        serverQueue.songs.shift();
        await play(guild, serverQueue.songs[0], message, client);
    }
})