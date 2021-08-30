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

        if (!serverQueue)
            return message.channel.send("There is nothing to skip!");

        serverQueue.songs.shift();

        if (serverQueue.songs.length < 0)
            return message.channel.send("There is nothing to skip!");

        if (serverQueue.songs.length == 0)
            stopCurrentSong(serverQueue);

        await play.run(guild, serverQueue.songs[0], message, client);
    }
})