const Event = require("../Structures/Event.js");

module.exports = new Event("messageCreate", (client, message) => {
    if(!message.content.startsWith(client.prefix)) return;

    const args = message.content.substring(client.prefix.length).split(/ +/);

    const command = client.commands.find(cmd => cmd.name == args[0].toLocaleLowerCase());

    if(!command) return message.reply(`I don't know this command... Type ${client.prefix}help to see what I can.`)

    command.run(message, args, client);
});