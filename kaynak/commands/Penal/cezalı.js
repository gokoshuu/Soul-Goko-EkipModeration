const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")
const ceza = require("../../models/cezalar.js")
const moment = require("moment")
let serverSettings = require("../../models/serverSettings");
require("moment-duration-format")
const sunucu = require("../../models/sunucu-bilgi")
class Cezalı extends Command {
    constructor(client) {
        super(client, {
            name: "cezalı",
            aliases: ["jail"]
        });
    }

    async run(message, args, level) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Cezalıya atmak istediğin kullanıcı geçerli değil.", message.author, message.channel)
        if (!args.slice(1).join(" ")) return this.client.yolla("Sebep belirtmeden cezalı işlemi uygulayamazsın.", message.author, message.channel)
        if(message.guild.members.cache.has(user.id)) {
        let member = message.guild.members.cache.get(user.id)
        if (member.roles.cache.has(server.BotCommandRole)) return this.client.yolla("Yetkililer birbirlerine ceza işlemi uygulayamazlar.", message.author, message.channel)
        if (message.guild.members.cache.get(user.id).permissions.has("MANAGE_ROLES")) return this.client.yolla("Üst yetkiye sahip kişileri yasaklayamazsın!", message.author, message.channel)
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
                .setDescription(`${user.tag} üyesi sunucuda olmamasına rağmen cezalıya atıldı. (Ceza Numarası: \`#${id + 1}\`)`)
                message.channel.send({ embeds: [embedx] })
                    await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} üyesi veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        yetkili: message.author.id,
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
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
                member.roles.set(member.roles.cache.has(server.BoosterRole) ? (server.BoosterRole, server.QuarantineRole) : server.QuarantineRole).catch(e => console.log(e))
                this.client.yolla("<@" + user + "> üyesine <@&"+ server.QuarantineRole + "> rolü verildi. (Ceza Numarası: `#" + sonrakii + "`)", message.author, message.channel)
                const zaaaa = new Discord.MessageEmbed() 
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setColor("32CD32")
                    .setFooter({ text: `Ceza Numarası: #${id + 1}`})
                    .setDescription(`
${user} (\`${user.tag}\` - \`${user.id}\`) kişisine <@&${server.QuarantineRole}> rolü verildi.
        
• Jail atılma tarihi: ${moment(Date.parse(new Date())).format("LLL")}
• Jail sebebi: ${args.slice(1).join(" ")}
        `)
                await this.client.channels.cache.get(server.JailLog).send({embeds: [zaaaa]})
                await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 15}** ulaştınız.`).catch(e => { })
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        roller: memberRoles,
                        yetkili: message.author.id,
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                })
            })
        }


    }
}

module.exports = Cezalı;
