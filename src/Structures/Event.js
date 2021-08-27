const Discord = require("discord.js");

const Client = require("./Client.js");

/**
 * @template {keyof Discord.ClientEvent} K
 * @param {Client} client 
 * @param  {Discord.ClientEvents[K]} eventArgs 
 */
function RunFunciton(client, ...eventArgs){

}

/**
 * @template {keyof Discord.ClientEvent} K
 */
class Event {
    /**
     * 
     * @param {K} event 
     * @param {RunFuction<K>} runFunciton 
     */
    constructor(event, runFunciton){
        this.event = event;
        this.run = runFunciton;
    }
}

module.exports = Event;