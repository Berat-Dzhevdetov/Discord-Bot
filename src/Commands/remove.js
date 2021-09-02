const Command = require("../Structures/Command");

module.exports = new Command({
    name: "remove",
    description: "Remove music from queue.",
    permission: "SEND_MESSAGES",

    async run(message, args, client) {
        if (!message.member.voice.channel)
            return await message.channel.send("You need to be connected to channel.");

        const guild = message.guild;

        let serverQueue = client.queue.get(guild.id);

        if (!serverQueue || !serverQueue.connection.dispatcher)
            return await message.channel.send("There is nothing to remove!");

        const indexToRemove = args[1];

        if (!indexToRemove)
            return await message.channel.send("Please provide index.");

        if (!parseInt(indexToRemove))
            return await message.channel.send("Please provide a number.");

        const index = (parseInt(indexToRemove) - 1);

        if (index < 0 || serverQueue.songs.length < index)
            return await message.channel.send("Invalid index.");

        const song = serverQueue.songs.splice(index, 1)[0];

        return await message.channel.send(`Removed **${song.title}** from queue.`);
    }
})