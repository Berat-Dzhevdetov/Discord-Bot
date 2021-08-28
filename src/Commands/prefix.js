const Command = require("../Structures/Command");

module.exports = new Command({
    name: "prefix",
    description : "Changes bot's prefix.",
    permission: "ADMINISTRATOR",
    
    async run(message, args, client){
        let newPrefix = args[1];

        if(!newPrefix)
            return message.reply("Please provide valid prefix.");

        if(newPrefix.length <= 0 || newPrefix.length >= 3) 
            return message.reply(`The new prefix should be between 1 and 2 symbols`);
        
        const regex = /^[\W]{1,2}$/;

        if(!regex.test(newPrefix))
            return message.reply(`The new prefix should be created only from special symbols.`);

        let oldPrefix = client.prefix;
        
        client.prefix = newPrefix;

        await message.channel.send(`Prefix changed from ${oldPrefix} to ${newPrefix}`);

        await client.changePrefix(newPrefix);
    }
})