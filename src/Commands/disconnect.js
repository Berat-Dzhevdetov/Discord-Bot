const Command = require("../Structures/Command");

module.exports = new Command({
    name: "disconnect",
    description: "Disconnect the author of the message from the channel.",
    permission: "SEND_MESSAGES",

    async run(message, _, __) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel)
            return await message.channel.send('You need to be in a channel to execute this command!');
            
        message.member.voice.setChannel(null);
    }
})