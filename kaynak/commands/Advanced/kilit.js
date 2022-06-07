const Command = require("../../base/Command.js")
const Discord = require("discord.js")
let serverSettings = require("../../models/serverSettings");
class Kanal extends Command {
    constructor(client) {
        super(client, {
            name: "kanal",
            aliases: ["kanal", "kilit"]
        });
    }
    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
if(!message.member.roles.cache.has(server.GuildOwner) && !message.member.permissions.has("ADMINISTRATOR")) return


const embed = new Discord.MessageEmbed()
.setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
.setColor("RANDOM")
.setDescription(`
Bu kanal şuan: ${message.channel.permissionsFor(message.guild.id).has('SEND_MESSAGES') ? "Açık" : "Kapalı" }
\`\`\`Komutu kullandığınız kanalın kilitlenmesini/açılmasını istiyorsanız: Kanal Kilit butonunu kullanın.\`\`\` 
Register sistemi şuan: ${server.RegisterSystem ? "Açık" : "Kapalı"}
\`\`\`Register voice kanallarının ve register sisteminin kilitlenmesini/açılmasını istiyorsanız: Register Kilit butonunu kullanın.\`\`\`

`)

const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId('ChannelLocking')
    .setLabel("Kanal Kilit")
    .setEmoji("🔒")
    .setStyle('PRIMARY'),
  new Discord.MessageButton()
    .setCustomId('RegisterLocking')
    .setLabel("Register Kilit")
    .setEmoji("🔒")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('CANCEL')
    .setLabel("İptal")
    .setStyle('DANGER'));

       var msg = await message.channel.send({ embeds: [embed], components: [row]})
       var filter = (button) => button.user.id === message.author.id;
       const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

       let channels = message.guild.channels.cache.filter(ch => ch.parentId == server.RegisterParent)

  collector.on("collect", async (button) => {
      if(button.customId === "ChannelLocking") {
      
        if (message.channel.permissionsFor(message.guild.id).has('SEND_MESSAGES')) {
        message.channel.permissionOverwrites.edit(message.guild.id, {
            SEND_MESSAGES: false
        }).then(async() => {
            await button.reply("Kanal başarıyla kilitlendi.")
        })
      } else {
        message.channel.permissionOverwrites.edit(message.guild.id, {
          SEND_MESSAGES: true
      }).then(async() => {
          await button.reply("Kanal kilidi açıldı.")
      })
      }
      } else if(button.customId === "RegisterLocking") {

       if(server.RegisterSystem) {
        server.RegisterSystem = false;
        server.save();
            channels.forEach(ch => {
              ch.permissionOverwrites.edit(`${server.UnregisteredRole}`, {
                 // SEND_MESSAGES: false,
                  CONNECT: false
              });
          });
          button.reply("Başarıyla register voice kanalları ve sistemi kilitlendi")
        } else if(!server.RegisterSystem) {
            server.RegisterSystem = true;
            server.save();
        
                channels.forEach(ch => {
                  ch.permissionOverwrites.edit(`${server.UnregisteredRole}`, {
                     // SEND_MESSAGES: true,
                      CONNECT: true
                  });
              });
              button.reply("Başarıyla register voice kanalları ve sistemi açıldı")
            }
      } else if(button.customId === "CANCEL") {
        row.components[0].setDisabled(true)
        row.components[1].setDisabled(true)
        row.components[2].setDisabled(true)
  
        msg.edit({ components: [row] })

        button.reply("İşlem iptal edildi.")
      }
  })

  collector.on("end", async (button) => {
      row.components[0].setDisabled(true)
      row.components[1].setDisabled(true)
      row.components[2].setDisabled(true)

      msg.edit({ components: [row] })
  })


  }

}



module.exports = Kanal;
