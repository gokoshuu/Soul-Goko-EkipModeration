const Command = require("../../base/Command.js");
const Discord = require("discord.js");
let serverSettings = require("../../models/serverSettings");
const notlar = require("../../models/notlar.js")
class Notlar extends Command {
    constructor(client) {
        super(client, {
            name: "Notlar",
            aliases: ["notlar", "uyarılar"]
        });
    }
    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Ceza notlarına bakmak istediğin kullanıcıyı belirtmen gerekir.", message.author, message.channel)
        await notlar.findOne({user: user.id}, async(err, res) => {
            if(!res) return this.client.yolla("Belirttiğin üyenin veritabanında ceza notu bulunmamaktadır.", message.author, message.channel)
            const notes = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription(`🚫 <@${user.id}> adlı kişinin ceza notları aşağıda belirtilmiştir.\n\n${res.notlar.map(x => `- Not Bırakan <@${x.yetkili}> | (\`${x.yetkili}\`)\n- Not: \`${x.not}\``).join("\n\n")}`, { split: true})
            .setColor("RANDOM")
            let notlarıms = res.notlar.map(x => `• Not Bırakan Yetkili: <@${x.yetkili}> | (\`${x.yetkili}\`)\n• Not: \`${x.not}\``)
            const MAX_CHARS = 3 + 2 + notlar.length + 3;
            if (MAX_CHARS > 2000) {
                const cann = new Discord.MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`🚫 <@${user.id}> kişisinin ceza notları fazla olduğundan dolayı son 10 not aşağıda belirtilmiştir.\n\n${notlarıms.reverse().join("\n\n")}`)
                .setColor("RANDOM")
                message.channel.send({ embeds: [cann] })
            } else {
                message.channel.send({ embeds: [notes] })    
                    }
        })
    }
}
    module.exports = Notlar;