const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
let serverSettings = require("../../models/serverSettings");
const mutes = require("../../models/voicemute.js")
const sunucu = require("../../models/sunucu-bilgi.js")
const wmute = require("../../models/waitMute.js")
class VMute extends Command {
    constructor(client) {
        super(client, {
            name: "vmute",
            aliases: ["vmute", "voicemute", "voice-mute"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.VoiceMuteAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Susturmak istediğin kullanıcıyı bulamadım.", message.author, message.channel)
        if (!args[1] || isNaN(ms(args[1]))) return this.client.yolla("Susturma süresini belirtmelisin.", message.author, message.channel)
        if (ms(args[1]) < ms("1m")) return this.client.yolla("Belirtilen susturma süresi geçerli değil.", message.author, message.channel)
        if (!args[2]) return this.client.yolla("Susturma sebebini belirtmelisin.", message.author, message.channel)
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        if (!message.member.roles.cache.get(server.GuildOwner)) {
            if (user.permissions.has("MANAGE_ROLES")) return this.client.yolla("Yöneticilere ceza-i işlem uygulayamazsın.", message.author, message.channel)
        if (user.roles.cache.has(server.BotCommandRole)) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        }
        if (user.voice.serverMute == true) return this.client.yolla("Kullanıcı zaten susturulmuş durumda.", message.author, message.channel)
        let time = ms(args[1]);
        let cıkaralım = time + Date.parse(new Date());
        let şuanki = moment(Date.parse(new Date())).format("LLL");
        let sonraki = moment(cıkaralım).format("LLL");
        let id = await data.countDocuments().exec();
        if(user.voice.channel) {
        user.voice.setMute(true)
        await message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.mute_name)} <@${user.id}> ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu. (Ceza Numarası: \`#${id + 1}\`)`)
        const mutelendi = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setColor("32CD32")
            .setFooter({ text: `Ceza Numarası: #${id + 1}`})
            .setDescription(`
${user} (\`${user.user.tag}\` - \`${user.id}\`) kişisi ${await this.client.turkishDate(time)} boyunca ses kanallarında susturuldu

• Ses Mute atılma tarihi: ${şuanki}
• Ses Mute bitiş tarihi: ${sonraki}
• Ses Mute sebebi: ${args.slice(2).join(" ")}
`)
            await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 10}** ulaştınız.`).catch(e => { })
            await this.client.channels.cache.get(server.VoiceMuteLog).send({embeds: [mutelendi]})
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + ms(args[1]),
                start: Date.now(),
                sebep: args.slice(2).join(" ")
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: id + 1,
                ceza: "Voice Mute",
                sebep: args.slice(2).join(" "),
                tarih: moment(Date.parse(new Date())).format("LLL"),
                bitiş: moment(Date.parse(new Date()) + ms(args[1])).format("LLL")
            })
            newData.save().catch(e => console.error(e))
        })
    } else {
        await wmute.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                await message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin ${await this.client.turkishDate(time)} sürelik ses mutesi başlatılamadı kullanıcı sese bağlanınca otomatik olarak cezası başlayacak. (Ceza Numarası: \`#${id + 1}\`)`)
            const newWmute = new wmute({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                sebep: args.slice(2).join(" "),
                date: time,
                cezano: id + 1
            })
            newWmute.save().catch(e => console.log(e))
        } else {
            return message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} <@${user.id}> kişisinin veritabanında halihazırda başlayacak bir cezası mevcut.`)
        }
        })
    }
    }
}

module.exports = VMute;
