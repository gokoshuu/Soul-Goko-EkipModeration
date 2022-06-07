const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment")
let serverSettings = require("../../models/serverSettings");
require("moment-duration-format")
moment.locale("tr")
class Tag extends Command {
    constructor(client) {
        super(client, {
            name: "tag",
            aliases: ["tag"]
        });
    }

    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        
        message.channel.send(`\`${server.Tag} - ${server.Tag2} - ${server.Tag3} - ${server.Tag4} - ${server.Tag5} - #${server.Etiket}\``)
        
    }
}

module.exports = Tag;
