const Command = require("../Structures/Command");
const clear = require("./clear");

module.exports = new Command({
    name: "leave",
    description: "Disconnect the bot from the channel.",
    permission: "ADMINISTRATOR",

    async run(message, _, client) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel)
            return message.channel.send('You need to be in a voice channel to do this!');

        clear.run(message, _, client);

        await voiceChannel.leave();
    }
})