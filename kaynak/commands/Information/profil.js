const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment")
const axios = require('axios')
require("moment-duration-format")
moment.locale("tr")
class Profil extends Command {
    constructor(client) {
        super(client, {
            name: "profil",
            aliases: ["profil", "i"]
        });
    }

    async run(message, args, data) {
        if(!message.member.permissions.has("VIEW_AUDIT_LOG")) return
        let user = args.length > 0 ? message.mentions.users.first() || await this.client.client_üye(args[0]) || message.author : message.author
     
     
        const embed = new Discord.MessageEmbed()
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor("BLACK")
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .addField("❯ Kullanıcı Bilgisi", "`•` Hesap: <@" + user.id + ">\n`•` Kullanıcı ID: " + user.id + "\n`•` Kuruluş Tarihi: " + moment(user.createdTimestamp).format("LLL") + " - (" + moment(user.createdTimestamp).fromNow() + ")", false)
        if (message.guild.members.cache.has(user.id)) {
            let member = message.guild.members.cache.get(user.id)
            let nickname = member.displayName == user.username ? "" + user.username + " [Yok] " : member.displayName
            const members = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
            const joinPos = members.map((u) => u.id).indexOf(member.id);
            const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
            const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
            const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
            const rolleri = []
            if (roles.length > 6) {
                const lent = roles.length - 6
                let itemler = roles.slice(0, 6)
                itemler.map(x => rolleri.push(x))
                rolleri.push(`${lent} daha...`)
            } else {
                roles.map(x => rolleri.push(x))
            }

            const bilgi = `${previous ? `**${previous.tag}** > ` : ""}<@${user.id}>${next ? ` > **${next.tag}**` : ""}`
            embed.addField("❯ Sunucu Bilgisi", "`•` Sunucu İsmi: " + nickname + "\n`•` Katılım Tarihi: " + moment(member.joinedAt).format("LLL") + " - (" + moment(member.joinedAt).fromNow() + ")\n`•` Katılım Sırası: " + joinPos + "/" + message.guild.members.cache.size + "\n`•` Katılım Bilgisi: " + bilgi + "\n\n`•` Rolleri (" + roles.length + "): " + rolleri.join(", ") + " ", false)
            embed.setColor(member.displayHexColor)
        }
      
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
                .setCustomId('banner')
                .setPlaceholder('Banner/Avatarını görüntülemek için tıkla!')
                .addOptions([
                    {
                        label: 'Banner',
                        description: 'Kullanıcının bannerini görüntülersiniz.',
                        value: 'banner',
                    },
                    {
                        label: 'Avatar',
                        description: 'Kullanıcının avatarını görüntülersiniz.',
                        value: 'avatar',
                    },
                ]),
        );
  let msg = await message.channel.send({ embeds: [embed], components: [row] })
  var filter = (menu) => menu.user.id === message.author.id;
  const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
 
  collector.on("collect", async (menu) => {
     if(menu.values[0] === "avatar") {
        menu.reply(`${user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
    } 
    else if(menu.values[0] === "banner") {

        async function bannerURL(user, client) {
            const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
            if(!response.data.banner) return "Kullanıcının banneri bulunmamakta!"
            if(response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
            else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
          
          }
        
          let bannerurl = await bannerURL(user.id,this.client)
        
          menu.reply({content: `${bannerurl}`})
   

      
        }
    })
    }
}

module.exports = Profil;
