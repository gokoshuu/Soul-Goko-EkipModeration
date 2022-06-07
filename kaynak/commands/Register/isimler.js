const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const isimler = require("../../models/isimler.js")
let serverSettings = require("../../models/serverSettings");

class İsimler extends Command {
  constructor(client) {
    super(client, {
      name: "isimler",
      usage: "erkek",
      aliases: ["isimler"]
    });
  }
  async run(message, args, level) {

    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });

  if (!message.member.roles.cache.some(r => server.RegisterAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
  let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
    if(!user) return this.client.yolla("Geçmiş isimlerine bakmak istediğin kullanıcıyı belirtmen gerekiyor!", message.author, message.channel)
      isimler.findOne({user: user.id}, async(err, res) => {
          if(!res) return this.client.yolla("Bu üyenin geçmiş isimleri bulunamadı.", message.author, message.channel)
          const zaa = new Discord.MessageEmbed()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
          .setDescription(`
Bu üyenin toplam da ${res.isimler.length} isim kayıtı bulundu:
          
${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}`)
          .setColor("RANDOM")
          message.channel.send({ embeds: [zaa] }).then(message => { setTimeout(() => { message.delete(); }, 10000);}).then(m => message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)))
      }) 
  }//(${x.yetkili.replace(message.author.id, `<@${x.yetkili}>`).replace(`Yok`,`Yok`)})
}
  module.exports = İsimler;
