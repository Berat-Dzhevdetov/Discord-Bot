const Command = require("../Structures/Command");

module.exports = new Command({
    name: "clear",
    description: "Clears the bot queue.",
    permission: "CONNECT,SPEAK",

    async run(message, _, client) {
        if (!message.member.voice.channel)
            return message.channel.send("You need to be connected to channel.");

        const guild = message.guild;

        let serverQueue = client.queue.get(guild.id);

        if (!serverQueue)
            return message.channel.send("There is nothing to skip!");

        if(serverQueue.connection.dispatcher)
            serverQueue.connection.dispatcher.destroy();

        await client.setLeaveTimeOut(guild);
        return await message.channel.send("The queue was cleaned.");
    }
})