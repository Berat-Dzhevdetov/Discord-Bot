const Command = require("../Structures/Command");

module.exports = new Command({
    name: "disconnect",
    description: "Disconnect the author of the message from the channel.",
    permission: "SEND_MESSAGES",

    async run(message, _, __) {
        message.member.voice.setChannel(null);
    }
})