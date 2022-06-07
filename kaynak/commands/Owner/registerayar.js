const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıtlar.js")
let serverSettings = require("../../models/serverSettings");
class TeyitAyar extends Command {
  constructor(client) {
      super(client, {
          name: "teyitmod",
          description: "Latency and API response times.",
          usage: "teyitmod",
          aliases: ["teyitmod"]
      });
  }
  async run(message, args, client) {
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
  if(!server.BotOwner.includes(message.author.id)) return

const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId('GenderRegister')
    .setLabel("Cinsiyet Teyit")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('ButtonRegister')
    .setLabel("Button Teyit")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('CANCEL')
    .setLabel("İptal")
    .setStyle('DANGER'))


   const embed = new Discord.MessageEmbed()
 
   .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })})
   .setColor("RANDOM")
   .setTitle(`Bu komut teyit modları arasında geçiş yapmanızı sağlar. Teyit modları:`)
   .setDescription(`
**1- Butonlu teyit (.isim @Göko 17 - Button seçim)**
**2- Normal teyit (.e @Göko 17)**
\`\`\`Şuanki teyit modu: ${server.GenderRegister ? "Normal teyit." :  "Butonlu teyit."}\`\`\``)
 

let msg = await message.channel.send({ embeds: [embed], components: [row] })

var filter = (button) => button.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

    collector.on("collect", async (button) => {
       
      if(button.customId === "GenderRegister") {

      row.components[0].setDisabled(true)
      msg.edit({ components: [row] })

      server.GenderRegister = true;
      server.save();
      button.reply("Teyit modu cinsiyet olarak değiştirildi. Artık \`.e @Göko 17\` ile kayıt yapılabilecek")

      } else if(button.customId === "ButtonRegister") {
        row.components[1].setDisabled(true)
        msg.edit({ components: [row] })

        server.GenderRegister = false;
        server.save();

        button.reply("Teyit modu buttonlu olarak değiştirildi. Artık \`.isim @Göko 17 - Button seçim\` ile kayıt yapılabilecek")

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


module.exports = TeyitAyar;
