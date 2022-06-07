const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
let serverSettings = require("../../models/serverSettings");
class NoUNBANRemove extends Command {
    constructor(client) {
        super(client, {
            name: "açılmazbanaç",
            aliases: ["açılmazban-kaldır", "açılmazbanaç","infazaç","infazac"]
        });
    }

    async run(message, args, client) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.GuildOwner.includes(message.author.id)) return
        let embed = new Discord.MessageEmbed()
        embed.setColor("RANDOM")
        embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })


        const whoisuseridd = args[0]
        if (isNaN(whoisuseridd)) return this.client.yolla('Lütfen geçerli bir kullanıcı ID\'si giriniz.', message.author , message.channel)
        const member = await this.client.users.fetch(whoisuseridd)
                message.guild.bans.fetchs(true).then(async (bans) => {
                    let ban = await bans.find(a => a.user.id === member.id)
                    if (!ban) {
                        embed.setDescription(`\`${member.tag}\` isimli üye bu sunucudan yasaklı değil.!`)
                        return message.channel.send({ embeds: [embed] })
                    } else {
                        await db.findOne({ user: member.id }, async (err, doc) => {
                            if (!doc) {
                                embed.setDescription(`**${member.tag}** kullanıcısının yasağı zaten kalıcı olarak işaretlenmemiş.`)
                                return message.channel.send({ embeds: [embed] })
                            } else {
                                embed.setDescription(`Bu komutu kullanmak için yeterli yetkilere sahip değilsin.`)
                                doc.delete().catch(e => console.log(e))
                                embed.setDescription(`**${member.tag}** kullanıcısının açılmaz ban etiketi kaldırıldı.`)
                                message.react(''+this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)+'')
                            }
                        })
                    }
                })
            }

}



module.exports = NoUNBANRemove;