const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const uyarılar = require("../../models/uyar.js")
let serverSettings = require("../../models/serverSettings");
const ms = require("ms")
const moment = require("moment")
const sunucu = require("../../models/sunucu-bilgi")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
const uyar = require("../../models/uyar.js");
const { MessageEmbed } = require("discord.js");
class Uyarılar extends Command {
    constructor(client) {
        super(client, {
            name: "uyarılar",
            aliases: ["uyarılar"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Uyarılarına bakmak istediğin kullanıcyı belirtmelisin", message.author, message.channel)
        uyarılar.findOne({user: user.id}, async(err,res) => {
            if(!res) return this.client.yolla("Belirttiğin kullanıcının uyarısı bulunmuyor.")
            let num = 1
            let uyarılarMap = res.uyarılar.map(x => `- ${num++}. numaralı uyarı ${this.client.users.cache.get(x.mod).tag} tarafından ${moment(x.tarih).format("LLL")} tarihinde "${x.sebep}" sebebiyle verilmiş.\n`).join("\n")
            const embed = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setColor("RANDOM")
            .setDescription(`${user} kullanıcısının tüm uyarıları aşağıda belirtilmiştir:\n\n\`\`\`${uyarılarMap}\`\`\``)
            message.channel.send({ embeds: [embed] })

        })
      
    }
}

module.exports = Uyarılar;
