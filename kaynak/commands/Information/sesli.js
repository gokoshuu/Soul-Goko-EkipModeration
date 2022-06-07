const Command = require("../../base/Command.js");
const Discord = require("discord.js");
let serverSettings = require("../../models/serverSettings");
class Sesli extends Command {
    constructor(client) {
        super(client, {
            name: "Sesli",
            aliases: ["sesli"]
        });
    }
 async run(message, args, data) {
    let server = await serverSettings.findOne({
        guildID: message.guild.id
    });
if(!message.member.permissions.has("VIEW_AUDIT_LOG")) return;
let pub = message.guild.channels.cache.filter(x => x.parentId == server.PublicParent && x.type == "GUILD_VOICE").map(u => u.members.size).reduce((a,b) => a+b)
let ses = message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").map(channel => channel.members.filter(member => !member.user.bot).size).reduce((a, b) => a + b);
let bot = message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").map(channel => channel.members.filter(member => member.user.bot).size).reduce((a, b) => a + b);
let tagges = message.guild.members.cache.filter(x => {
return x.user.username.includes(server.Tag) && x.voice.channel && !x.roles.cache.has(server.BotCommandRole)}).size
let notag = message.guild.members.cache.filter(x => {
return !x.user.username.includes(server.Tag) && x.voice.channel}).size
let yetkili = message.guild.members.cache.filter(x => {
return x.user.username.includes(server.Tag) && x.voice.channel && x.roles.cache.has(server.BotCommandRole)}).size
const embed = new Discord.MessageEmbed()
.setColor("RANDOM")
.setDescription(`Sesli kanallarda toplam **${ses} (+${bot} bot)** kişi var!
───────────────
Public odalarda **${pub}** kişi var!
Ses kanallarında **${notag}** normal kullanıcı var!
Ses kanallarında **${tagges}** taglı kullanıcı var!
Ses kanallarında toplam **${yetkili}** yetkili var!`)
return message.channel.send({ embeds: [embed] }).then(m => message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)));        
}
}
module.exports = Sesli;
