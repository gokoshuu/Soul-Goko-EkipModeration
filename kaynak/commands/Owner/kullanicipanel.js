const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıtlar.js")
let serverSettings = require("../../models/serverSettings");
class KullanıcıPanel extends Command {
  constructor(client) {
      super(client, {
          name: "kullanıcıpanel",
          usage: ".panel",
          category: "BotOwner",
          description: "Kullanıcı panel mesajını attırmaya sağlar.",
          aliases: ["panel","kullanıcıpanel"]
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
    .setCustomId('memberJoinedServer')
    .setLabel("1")
    .setStyle('PRIMARY'),
  new Discord.MessageButton()
    .setCustomId('historyName')
    .setLabel("2")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('activePenalties')
    .setLabel("3")
    .setStyle('PRIMARY'))

    const row2 = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId('penaltyPoints')
    .setLabel("4")
    .setStyle('PRIMARY'),
  new Discord.MessageButton()
    .setCustomId('historyPenalties')
    .setLabel("5")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('notes')
    .setLabel("6")
    .setStyle('PRIMARY'))

    const row3 = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId('penaltiesNumber')
    .setLabel("7")
    .setStyle('PRIMARY'),
  new Discord.MessageButton()
    .setCustomId('memberRoles')
    .setLabel("8")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('createdAt')
    .setLabel("9")
    .setStyle('PRIMARY'))

    message.channel.send({ content: `
Aşağıdaki menüden kendinize bir işlem seçip sunucu içi depolanan verilerinizi sorgulayabilirsiniz. Verileriniz sadece sizin görebileceğiniz şekilde gönderilir.
• 1: Sunucuya giriş tarihinizi öğrenin.
• 2: Kayıt olmuş olduğunuz isimleri öğrenin.
• 3: Devam eden cezanız (varsa) hakkında bilgi alın.
 
• 4: Ceza puanınızı öğrenin.
• 5: Geçmiş cezalarınızı öğrenin.
• 6: Notlarınıza bakın.
• 7: Ceza sayınız öğrenin.
• 8: Üzerinizdeki rolleri sıralayın.
• 9: Hesabınızın açılış tarihini öğrenin.`,
     components: [row, row2, row3]
 })


  
  }

}
module.exports = KullanıcıPanel;