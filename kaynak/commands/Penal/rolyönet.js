const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const roller = require("../../models/rollog.js")
const moment = require("moment")
let serverSettings = require("../../models/serverSettings");
require("moment-duration-format")
moment.locale("tr")

class Rolyonet extends Command {
    constructor(client) {
        super(client, {
            name: "r",
            aliases: ["r"]
        });
    }
    // d!r args[0](al-ver) args[1](Kullanıcı) args[2](Rol)
    async run(message, args, level) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.RoleManageAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        if (!args[0]) return this.client.yolla("Kullanımı: !r al/ver @Göko RolID", message.author, message.channel)
        if (args[0] != "al") {
            if (args[0] != "ver") {
                return this.client.yolla("Kullanımı: !r al/ver @Göko RolID", message.author, message.channel)
            }
        }
        if (!args[1]) return this.client.yolla("Kullanıcıyı belirtmelisin.", message.author, message.channel)
        let user = message.mentions.members.first() || await this.client.üye(args[1], message.guild)
        if (!user) return this.client.yolla("Kullanıcıyı düzgünce belirt ve tekrar dene !", message.author, message.channel)
        if (!args[2]) return this.client.yolla("Rolü belirtmelisin.", message.author, message.channel)
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
        if (!role) return this.client.yolla("Belirtmiş olduğun rolü bulamadım ! Düzgün bir rol etiketle veya ID belirtip tekrar dene.", message.author, message.channel)
        if (message.member.roles.highest.rawPosition <= role.rawPosition) return this.client.yolla("Kendi rolünden yüksek veya eşit bir rolle işlem yapamazsın.", message.author, message.channel)
        if (!role.editable) return
    // if (this.client.config.roles.authyRoles.highest.position >= role.position.includes(role.id)) return this.client.yolla("Yetki rolleri ile işlem yapamazsın.", message.author, message.channel)
        let banNum = this.client.roleLimit.get(message.author.id) || 0
        this.client.roleLimit.set(message.author.id, banNum + 1)
        if (banNum == 5) return this.client.yolla("Gün içerisinde çok fazla rol işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
        if (args[0] == "al") {
            const embedu = new Discord.MessageEmbed()
            embedu.setAuthor({ name: message.guild.name, iconURL: this.client.user.displayAvatarURL({ dynamic: true })})
    
            embedu.setColor("RANDOM")
            if (user.roles.cache.has(role.id)) {
                user.roles.remove(role.id)
                embedu.setDescription(`${user} Kişisinden ${role} rolünü aldım.`)
                const emeed = new Discord.MessageEmbed()
                    .setAuthor({ name: message.guild.name, iconURL: this.client.user.displayAvatarURL({ dynamic: true })})
                    .setColor("RANDOM")
                    .setDescription(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} ${user} - (\`${user.id}\`) kişisinden rol alındı!`)
                    .addField("Alan Kişi", `<@${message.author.id}> - (\`${message.author.id}\`)`, false)
                    .addField("Alınan Rol", `${role}`, false)
                    .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({
                        dynamic: true
                    })})
                    .setTimestamp()
                    this.client.channels.cache.get(server.BotRoleManageLog).send({ embeds: [emeed] })
                roller.findOne({
                    user: user.id
                }, async (err, res) => {
                    if (!res) {
                        let arr = []
                        arr.push({
                            rol: role.id,
                            mod: message.author.id,
                            tarih: Date.parse(new Date()),
                            state: "Kaldırma"
                        })
                        let newData = new roller({
                            user: user.id,
                            roller: arr
                        })
                        newData.save().catch(e => console.log(e))
                    } else {
                        res.roller.push({
                            rol: role.id,
                            mod: message.author.id,
                            tarih: Date.parse(new Date()),
                            state: "Kaldırma"
                        })
                        res.save().catch(e => console.log(e))
                    }
                })
            } else {
                embedu.setDescription(`${user} Kişisinde ${role} rolü mevcut değil.`)
            }
            message.channel.send({ embeds: [embedu] })
        }
        if (args[0] == "ver") {
            const embedu = new Discord.MessageEmbed()
            embedu.setAuthor({ name: message.guild.name, iconURL: this.client.user.displayAvatarURL({ dynamic: true })})
            embedu.setColor("RANDOM")
            if (!user.roles.cache.has(role.id)) {
                user.roles.add(role.id)
                embedu.setDescription(`${user} Kişisine ${role} rolünü ekledim.`)

                roller.findOne({
                    user: user.id
                }, async (err, res) => {
                    if (!res) {
                        let arr = []
                        arr.push({
                            rol: role.id,
                            mod: message.author.id,
                            tarih: Date.parse(new Date()),
                            state: "Ekleme"
                        })
                        let newData = new roller({
                            user: user.id,
                            roller: arr
                        })
                        newData.save().catch(e => console.log(e))
                    } else {
                        res.roller.push({
                            rol: role.id,
                            mod: message.author.id,
                            tarih: Date.parse(new Date()),
                            state: "Ekleme"
                        })
                        res.save().catch(e => console.log(e))
                    }
                })
            } else {
                embedu.setDescription(`${user} Kişisinde ${role} rolü zaten mevcut.`)
            }
            message.channel.send({ embeds: [embedu] })
        }
    }
}
module.exports = Rolyonet
