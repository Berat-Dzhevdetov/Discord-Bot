const Command = require("../Structures/Command");

module.exports = new Command({
    name: "move",
    description: "Moves song from given index to given index.",
    permission: "SEND_MESSAGES",

    async run(message, args, client) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel)
            return await message.channel.send('You need to be in a channel to execute this command!');

        const serverQueue = client.queue.get(message.guild.id);

        if (!serverQueue)
            return message.channel.send('There is nothing playing.');

        const from = args[1];
        const to = args[2];

        if (!from)
            return message.channel.send('Please give **from** index');
        if (!to)
            return message.channel.send('Please give **to** index');

        if (!parseInt(from))
            return message.channel.send('Please give number for **from** index');
        if (!parseInt(to))
            return message.channel.send('Please give number for **to** index');

        const parsedFrom = (parseInt(from)) - 1;
        const parsedTo = (parseInt(to)) - 1;

        if ((parsedFrom < 0 || parsedTo < 0) || 
            (serverQueue.songs.length < parsedFrom || serverQueue.songs.length < parsedTo))
            return message.channel.send('Invalid arguments');

        let temp = serverQueue.songs.splice(parsedFrom, 1);

        serverQueue.songs.splice(parsedTo, 0, temp[0]);

        return message.channel.send(`Moved **${serverQueue.songs[parsedTo].title}** to ${parsedTo + 1} index.`);
    }
})