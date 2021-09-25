const Command = require("../Structures/Command");

module.exports = new Command({
    name: "queue",
    description: "Show a list with with song that are in bot queue.",
    permission: "CONNECT,SPEAK",

    async run(message, _, client) {
        if (!message.member.voice.channel)
            return message.channel.send("You need to be connected to channel.");

        const guild = message.guild;

        let serverQueue = client.queue.get(guild.id);

        if (!serverQueue)
            return message.channel.send("There is nothing in the queue!");

        let queueAsText = "";

        queueAsText += `1. Now playing - **${serverQueue.songs[0].title}**\n`;

        for (let i = 1; i < serverQueue.songs.length; i++) {
            const song = serverQueue.songs[i];
            queueAsText += `${i + 1}. ${song.title}\n`;
        }
        
        return message.channel.send(queueAsText);
    }
})