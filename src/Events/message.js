const Event = require("../Structures/Event.js");

module.exports = new Event("message", (client, message) => {
    if(!message.content.startsWith(client.prefix)) return;

    const args = message.content.substring(client.prefix.length).split(/ +/);

    let commandName = args[0].toLocaleLowerCase();

    switch (commandName) {
        case 'p':
            commandName = "play";
            break;
    }

    const command = client.commands.find(cmd => cmd.name == commandName);

    if(!command) return message.reply(`I don't know this command... Type ${client.prefix}help to see what I can.`)

    const permission = message.member.permissions;

    let doesTheUserHavePermisison = true;
    command.permission.split(',').forEach(per => {
        if(!permission.has(per, true)){
            doesTheUserHavePermisison = false;
            return message.reply(`You don't have the permission '${per}' to run this command.`);
        }
    });

    if(!doesTheUserHavePermisison)
        return;

    command.run(message, args, client);
});