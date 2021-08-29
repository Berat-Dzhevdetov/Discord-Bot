const Command = require("../Structures/Command");

module.exports = new Command({
    name: "help",
    description: "Shows a list of bot's commands.",
    permission: "SEND_MESSAGES",

    async run(message, _, client) {
        let msgToSend = "\`\`\`json\n";
        let index = 1;

        client.commands.filter(c => c.name != "help").forEach(command => {
            msgToSend += `${index}. ${client.prefix}${command.name}\n   ${command.description}\n`;
            index++;
        });

        msgToSend += "\`\`\`";

        message.reply(msgToSend);
    }
})