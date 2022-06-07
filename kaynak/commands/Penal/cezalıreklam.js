const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")
const ceza = require("../../models/cezalar.js")
let serverSettings = require("../../models/serverSettings");
const moment = require("moment")
require("moment-duration-format")
const sunucu = require("../../models/sunucu-bilgi")
class Reklam extends Command {
    constructor(client) {
        super(client, {
            name: "reklam",
            aliases: ["reclam"]
        });
    }

    async run(message, args, level) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Cezalıya atmak istediğin kullanıcı geçerli değil.", message.author, message.channel)
        if(message.guild.members.cache.has(user.id)) {
        let member = message.guild.members.cache.get(user.id)
        if (member.roles.cache.has(server.BotCommandRole)) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        if (message.guild.members.cache.get(user.id).permissions.has("VIEW_AUDIT_LOG")) return this.client.yolla("Üst yetkiye sahip kişileri yasaklayamazsın!", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kişilere işlem uygulayamazsın!", message.author, message.channel)
        }
        if (user.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)
        let id = await ceza.countDocuments().exec();
        let banNum = this.client.jailLimit.get(message.author.id) || 0
        this.client.jailLimit.set(message.author.id, banNum + 1)
        if (banNum == 5) return this.client.yolla("Gün içerisinde çok fazla jail işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
        if (!message.guild.members.cache.has(user.id)) {
            const embedx = new Discord.MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor("RANDOM")
                .setDescription(`${user.tag} kullanıcısı sunucuda bulunmamasına rağmen cezalıya atıldı. Sunucuya girişi engellendi. (Ceza Numarası: \`#${id + 1}\`)`)
                message.channel.send({ embeds: [embedx] })
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        yetkili: message.author.id,
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        sebep: "Reklam"
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Reklam - Cezalı",
                        sebep: "Reklam",
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        bitiş: moment(Date.parse(new Date())).format("LLL")
                    })
                    newData.save().catch(e => console.error(e))
                })
            })
        } else {
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                let member = message.guild.members.cache.get(user.id)
                let memberRoles = member.roles.cache.map(x => x.id)
                let sonrakii = id + 1
                member.roles.set(member.roles.cache.has(server.BoosterRole) ? (server.BoosterRole, server.ADSRole) : server.ADSRole).catch(e => console.log(e))
                this.client.yolla("<@" + user + "> üyesine <@&" + server.ADSRole + "> rolü verildi. (Ceza Numarası: `#" + sonrakii + "`)", message.author, message.channel)
                await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 20}** ulaştınız.`).catch(e => { })
                const zaaaa = new Discord.MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor("RANDOM")
                    .setDescription(`${user} üyesine __Reklam__ sebebi ile <@&${server.ADSRole}> rolü verildi.`)
                    .setFooter({ text: `${moment(Date.parse(new Date())).format("LLL")}`})
                await this.client.channels.cache.get(server.JailLog).send({embeds: [zaaaa]})
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        roller: memberRoles,
                        yetkili: message.author.id,
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        sebep: "Reklam"
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Cezalı - Reklam",
                        sebep: "Reklam",
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                })
            })
        }


    }
}

module.exports = Reklam;
