const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
const mutes = require("../../models/voicemute.js")
let serverSettings = require("../../models/serverSettings");
const sunucu = require("../../models/sunucu-bilgi.js")
const wmute = require("../../models/waitMute.js")
class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            aliases: ["unmute","unvmute","vunmute"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });

        if (!message.member.roles.cache.some(r => server.ChatMuteAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply("Lütfen bir kullanıcı belirleyiniz");
        
        await data.find({ user: target.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
            if(!res) return this.client.yolla(`${target} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)
       
         let cezasayı = await this.client.cezasayı(target.id)
         let puan = await this.client.punishPoint(target.id)
        let durum;
        if(cezasayı < 5) durum = "Çok Güvenli";
        if(cezasayı >= 5 && cezasayı < 10) durum = "Güvenli";
        if(cezasayı >= 10 && cezasayı < 15) durum = "Şüpheli";
        if(cezasayı >= 15 && cezasayı < 20) durum = "Tehlikeli";
        if(cezasayı >= 20) durum = "Çok Tehlikeli";

        
        const embed = new Discord.MessageEmbed()
        .setAuthor({ name: target.user.tag, iconURL: target.user.avatarURL({ dynamic: true })})
        .setDescription(`${target} üyesinin kaldırmak istediğiniz voice-chat mute ceza türünü aşağıdaki buttonlardan seçiniz!`)
        .setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"})
        .setColor("RANDOM")

        const row = new Discord.MessageActionRow()
  .addComponents(
    new Discord.MessageButton()
      .setCustomId('ChatMute')
      .setLabel("Chat Mute")
      .setStyle('PRIMARY'),
    new Discord.MessageButton()
      .setCustomId('VoiceMute')
      .setLabel("Voice Mute")
      .setStyle('PRIMARY'),
      new Discord.MessageButton()
      .setCustomId('CANCEL')
      .setLabel("İptal")
      .setStyle('DANGER'))

      let msg = await message.channel.send({ components: [row], embeds: [embed] })

var filter = (button) => button.user.id === message.author.id;
const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
        
collector.on('end', async (button, user) => {
row.components[0].setDisabled(true) 
row.components[1].setDisabled(true) 
row.components[2].setDisabled(true) 
msg.edit({ components: [row] }); 
    

});

collector.on('collect', async (button, user) => {
if (button.customId === "ChatMute") {
row.components[0].setDisabled(true) 
msg.edit({ components: [row] }); 

if(!target.roles.cache.has(`${server.ChatMuteRole}`)) return button.reply({ content: "Belirttiğin kullanıcının geçerli bir chatmute cezası bulunmamakta!", ephemeral: true });
if (target.roles.cache.has(`${server.ChatMuteRole}`)) {
          await target.roles.remove(server.ChatMuteRole).then(async (user) => { button.reply({ content: `Başarılı bir şekilde <@${user.id}> adlı kullanıcının mutesini kaldırdınız.`, ephemeral: true })});
      

}
} else if (button.customId === "VoiceMute") {
    row.components[1].setDisabled(true) 
    msg.edit({ components: [row] }); 
  
    if(!target.voice.serverMute) return button.reply({ content: "Kullanıcının geçerli bir voice mute cezası yok!", ephemeral: true })
    if (target.voice.serverMute == true) {
     button.reply({ content: `Başarılı bir şekilde <@${target.id}> adlı kullanıcının ses mutesini kaldırdınız.`, ephemeral: true });        
        target.voice.setMute(false)
    
    } 
} else if (button.customId === "CANCEL") {
        row.components[0].setDisabled(true) 
        row.components[1].setDisabled(true) 
        row.components[2].setDisabled(true) 
        msg.edit({ components: [row] }); 
        button.reply({ content: `İşlem iptal edildi.`, ephemeral: true });

        
      
    } 

})
}); 
       
    }
}
module.exports = Unmute;
