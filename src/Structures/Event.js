/**
 * @template {keyof Discord.ClientEvent} K
 * @param {Client} client 
 * @param  {...Discord.ClientEvents[K]} eventArgs 
 */
function runFunciton(client, ...eventArgs){

}

class Event {
    constructor(event, runFunciton){
        this.event = event;
        this.runFunciton = runFunciton;
    }
}

module.exports = Event;