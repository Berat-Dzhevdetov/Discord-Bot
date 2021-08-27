const Command = require("../Structures/Command");

module.exports = new Command({
    name: "ping",
    description : "Shows the ping of the bot.",
    
    async run(message, _, client){
        
        message.reply(`Ping: ${client.ws.ping} ms.`);

    }
})