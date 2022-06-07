const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment")
let serverSettings = require("../../models/serverSettings");
require("moment-duration-format")
moment.locale("tr")
class Link extends Command {
    constructor(client) {
        super(client, {
            name: "link",
            aliases: ["link"]
        });
    }

    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        
        message.channel.send(server.Link)
        
    }
}

module.exports = Link;
