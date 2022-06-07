const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
let serverSettings = require("../../models/serverSettings");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class BanBilgi extends Command {
    constructor(client) {
        super(client, {
            name: "ban-bilgi",
            aliases: ["banbilgi"]
        });
    }

    async run(message, args, client) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.BanAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
      let embed = new Discord.MessageEmbed()
      embed.setColor("RANDOM")
      embed.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
   
      const whoisuseridd = args[0]
      if (isNaN(whoisuseridd)) return this.client.yolla('Lütfen geçerli bir kullanıcı ID\'si giriniz.', message.author , message.channel)
      const member = await this.client.users.fetch(whoisuseridd)

      const fetchBans = message.guild.bans.fetch()
              fetchBans.then(async(bans) => {
                  let ban = await bans.find(a => a.user.id === member.id)
                  if(!ban){
                      embed.setDescription(`belirttiğin \`${member.tag}\` üyesi bu sunucuda yasaklı değil!`)
                      return message.channel.send({ embeds: [embed] })
                  }else{
                      let text = `${member.tag} (\`${member.id}\`) kullanıcının sunucumuzdan yasaklanma sebebi aşağıda verilmiştir:

"${ban.reason || "Sebep Belirtilmemiş."}"`
                     await db.findOne({userid: member.id}, async(err,dbres) => {
                          if(dbres){
                              text = `:warning: **BU YASAKLAMA <@${dbres.mod}> TARAFINDAN AÇILAMAZ OLARAK ETİKETLENMİŞTİR.**

${res.tag} (\`${res.id}\`) kullanıcının sunucumuzdan yasaklanma sebebi aşağıda verilmiştir:

"${ban.reason || "Sebep Belirtilmemiş."}"`
                          }
                      })
                      message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                          let user = audit.entries.find(a => a.target.id === member.id)
                          if(user){
                              embed.setDescription(text + `\n\Belirttiğin kullanıcı, ${user.executor.tag} (\`${user.executor.id}\`) tarafından ${moment(user.createdAt).format("lll")} tarihinde yasaklanmış.`)
                              return message.channel.send({ embeds: [embed] })
                          }else{
                              embed.setDescription(text + "\n\nBilgisini öğrenmek istediğin ban, son 100 yasaklama içerisinde olmadığı için ne yazık ki bilgileri sana gösteremiyorum.")
                              return message.channel.send({ embeds: [embed] })
                          }
                      })
                  }
              })
          }
        }



module.exports = BanBilgi;
