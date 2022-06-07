const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const uyarılar = require("../../models/uyar.js")
const ms = require("ms")
const moment = require("moment")
const sunucu = require("../../models/sunucu-bilgi")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
const uyar = require("../../models/uyar.js");
let serverSettings = require("../../models/serverSettings");
class Uyar extends Command {
    constructor(client) {
        super(client, {
            name: "uyar",
            aliases: ["uyar"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Uyarmak istediğin kullanıcyı belirtmelisin", message.author, message.channel)
        let sebep = args.slice(1).join(" ")
        if(!sebep) return this.client.yolla("Kullanıcının uyarı sebebini belirtmelisin.", message.author, message.channel)
        let id = await data.countDocuments().exec();
        uyarılar.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                let arr = []
                arr.push({mod: message.author.id, sebep: sebep, tarih: Date.parse(new Date())})
                const newWarn = new uyarılar({
                    user: user.id,
                    uyarılar: arr
                })
                newWarn.save().catch(e => console.log(e))
                user.roles.add(server.WarnRoleOne)
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Uyarı",
                        sebep: sebep,
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                })
                message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} ${user} kişisine **${sebep}** sebebiyle ilk uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id) + 3}\` oldu. (Ceza Numarası: \`#${id + 1}\`)`)
                await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 3}** ulaştınız.`).catch(e => { })
            } else {
                res.uyarılar.push({mod: message.author.id, sebep: sebep, tarih: Date.parse(new Date())})
                res.save().catch(e => console.log(e))
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: id + 1,
                        ceza: "Uyarı",
                        sebep: sebep,
                        tarih: moment(Date.parse(new Date())).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                })
                if(res.uyarılar.length == 2) {
                    message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} ${user} kişisine **${sebep}** sebebiyle 2. uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id) + 3}\` oldu. (Ceza Numarası: \`#${id + 1}\`)`)
                    await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 3}** ulaştınız.`).catch(e => { })
                    await user.roles.remove(server.WarnRoleOne)
                    await user.roles.add(server.WarnRoleTwo)
                }
                if(res.uyarılar.length == 3) {
                    message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} ${user} kişisine **${sebep}** sebebiyle 3. uyarısı verildi.Kullanıcının ceza puanı \`${await this.client.punishPoint(user.id) + 3}\` oldu. (Ceza Numarası: \`#${id + 1}\`)`)
                    await this.client.channels.cache.get(server.PenaltyPointLog).send(`${user}; adlı üye aldığınız **#${id + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 8}** ulaştınız.`).catch(e => { })
                   await user.roles.remove(server.WarnRoleTwo)
                   await user.roles.add(server.WarnRoleThree)
                }
                if(res.uyarılar.length >= 4) {
                  message.channel.send(`kullanıcı zaten maksimum uyarı seviyesine ulaşmış. \`!uyarılar @Kullanıcı\` yaparak uyarı geçmişini görebilirsin`)
                }

            }

        })
      
    }
}

module.exports = Uyar;
