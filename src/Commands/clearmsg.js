const Command = require("../Structures/Command");
const Discord = require('discord.js');

module.exports = new Command({
    name: "clearmsg",
    description: `Clear amount of messages. For example: clearmsg 34`,
    permission: "MANAGE_MESSAGES",

    async run(message, args, _) {
        let ammount = args[1];

        if (!ammount || isNaN(ammount))
            return message.reply(`${ammount == undefined ? "Nothing" : ammount} is not valid number!`)

        const parsedAmmont = parseInt(ammount);

        if (parsedAmmont > 100) return message.reply(`You cannot clear more than 100 messages at once.`);
        else if (parsedAmmont <= 0) return message.reply(`Don't make strange thinks like that... they scare me.`);

        try {
            message.channel.bulkDelete(parsedAmmont);
            const msg = await message.channel.send(`Cleared ${parsedAmmont} messages.`);

            setTimeout(() => {
                msg.delete()
                .catch(err => err.code === Discord.Constants.APIErrors.UNKNOWN_MESSAGE ? undefined : console.error("Error coudn't delete alert clean msg"));
            }, 5000);

        } catch (error) {
            const msg = await message.channel.send(`I can delete only messages that are under 14 days old.`);

            setTimeout(() => {
                msg.delete();
            }, 5000);
        }
    }
})