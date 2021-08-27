const Discord = require("discord.js");

const Command = require("./Command.js");

const Event = require("./Event.js");

const fs = require("fs");

const intents = new Discord.Intents(32767);

class Client extends Discord.Client {
    constructor() {
        super({ intents })

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
    }

    /**
     * 
     * @param {string} token 
     */
    start(token) {

        fs.readdirSync('../src/Commands')
            .filter(file => file.endsWith(".js"))
            .forEach(file => {
                /**
                 * @type {Command}
                 */
                const command = require(`../Commands/${file}`);

                this.commands.set(command.name, command);
            });

        fs.readdirSync('../src/Events')
            .filter(file => file.endsWith(".js"))
            .forEach(file => {
                /**
                 * @type {Event}
                 */
                const event = require(`../Events/${file}`);

                this.on(event.event, event.run.bind(null, this));
            });

        client.login(token);
    }
}

module.exports = Client;