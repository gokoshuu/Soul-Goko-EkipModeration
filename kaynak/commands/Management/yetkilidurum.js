const Command = require("../../base/Command.js");
const Discord = require("discord.js");
let serverSettings = require("../../models/serverSettings");

class Yetkilidurum extends Command {
    constructor(client) {
        super(client, {
            name: "yetkili-durum",
            aliases: ["yetkilidurum", "ytdurum", "ydurum"]
        });
    }
    async run(message, args, level) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if (!message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let enAltYetkiliRolü = message.guild.roles.cache.get(`${server.BotCommandRole}`);
        let yetkili = message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= enAltYetkiliRolü.position).size;
        let sesteolmayan = message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= enAltYetkiliRolü.position && !uye.voice.channel && (uye.presence && uye.presence.status !== "offline")).size;
        let sesteolan = message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= enAltYetkiliRolü.position && uye.voice.channel).size;
        const avatar = new Discord.MessageEmbed()
        
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setDescription(`
• Sunucumuzda bulunan toplam yetkili sayısı: \`${yetkili}\`
• Sunucumuzda aktif olup seste olmayan yetkili sayısı: \`${sesteolmayan}\`
• Sunucumuzda ses kanallarında bulunan yetkili sayısı: \`${sesteolan}\`
`)
        .setColor("PURPLE")
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        message.channel.send({ embeds: [avatar] }).then(message => { setTimeout(() => { message.delete(); }, 10000); })
    }
}

module.exports = Yetkilidurum;
//