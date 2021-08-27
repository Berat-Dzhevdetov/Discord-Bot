const Client = require('./Structures/Client.js');

const config = require('./Data/config.json');

const client = new Client();

client.start(config.token)

client.on("ready", () => console.log("Bot is online"));

client.on("messageCreate", message => {

    if(!message.content.startsWith(config.prefix)) return;

    const args = message.content.substring(config.prefix.length).split(/ +/);

    const command = client.commands.find(cmd => cmd.name == args[0].toLocaleLowerCase());

    if(!command) return message.reply(`I don't know this command... Type ${config.prefix}help to see what I can.`)

    command.run(message, args, client);
})
