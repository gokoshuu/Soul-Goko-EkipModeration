const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment")
let serverSettings = require("../../models/serverSettings");
require("moment-duration-format")
moment.locale("tr")
class Snipe extends Command {
    constructor(client) {
        super(client, {
            name: "snipe",
            aliases: ["snipe"]
        });
    }

    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
  if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
let mesaj = this.client.snipe.get(message.channel.id)
if(!mesaj) return message.react("🚫")
const embed = new Discord.MessageEmbed()
.setColor("RANDOM")
.setAuthor({ name: mesaj.author.tag, iconURL: mesaj.author.displayAvatarURL({ dynamic: true }) })
.setDescription(mesaj.content)
.setFooter({ text: "Silinen Tarih: " + moment(mesaj.createdTimestamp).add(3, 'hour').format("ll") + ", " + moment(mesaj.createdTimestamp).add(3, 'hour').format("LTS")})
message.channel.send({ embeds: [embed] }).then(msg => { setTimeout(() => { msg.delete(); }, 3500); })
this.client.snipe.delete(message.channel.id)
        
    }
}

module.exports = Snipe;
