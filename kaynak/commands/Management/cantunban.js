const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
let serverSettings = require("../../models/serverSettings");
class NoUNBAN extends Command {
    constructor(client) {
        super(client, {
            name: "infaz",
            aliases: ["açılmazban", "infaz"]
        });
    }

    async run(message, args, client) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.GuildOwner.includes(message.author.id)) return
        let embed = new Discord.MessageEmbed()
        embed.setColor("RANDOM")
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })

        const whoisuseridd = args[0]
        if (isNaN(whoisuseridd)) return this.client.yolla('Lütfen geçerli bir kullanıcı ID\'si giriniz.', message.author , message.channel)
        const member = await this.client.users.fetch(whoisuseridd)
        const fetchBans = message.guild.bans.fetch()
                fetchBans.then(async (bans) => {
                    let ban = await bans.find(a => a.user.id === member.id)
                    if (!ban) {
                        embed.setDescription(`\`${member.tag}\` isimli üye bu sunucudan yasaklı değil.`)
                        return message.channel.send({ embeds: [embed] })
                    } else {
                        await db.findOne({ user: member.id }, async (err, doc) => {
                            if (doc) {
                                embed.setDescription(`**${member.tag}** kullanıcısı zaten <@${doc.mod}> yetkilisi tarafından kalıcı olarak yasaklandı.`)
                                return message.channel.send({ embeds: [embed] })
                            } else {
                                message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                                    let user = audit.entries.find(a => a.target.id === member.id)
                                    if(user && user.executor.id !== message.author.id) return
                                    if(!user) return this.client.yolla(`Bu üye son 100 yasaklama içinde bulunamıyor.`, message.author, message.channel)
                                })
                                const newBanData = new db({
                                    user: member.id,
                                    mod: message.author.id,
                                    sebep: ban.reason || "Sebep Belirtilmedi."
                                })
                                newBanData.save().catch(e => console.log(e))
                            }
                            embed.setDescription(`**${member.tag}** kullanıcısının yasağı açılamaz olarak işaretlendi.`)
                            message.channel.send({ embeds: [embed] })
                            message.react(''+this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)+'')
                        })
                    }
                })
            }

    }


module.exports = NoUNBAN;