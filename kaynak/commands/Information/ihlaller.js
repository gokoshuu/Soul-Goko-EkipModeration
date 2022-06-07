const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
let serverSettings = require("../../models/serverSettings");
const Discord = require("discord.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
class Cezalar extends Command {
    constructor(client) {
        super(client, {
            name: "cezalar",
            aliases: ["cezalar", "ihlaller"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Ceza bilgilerine bakmak istediğin kullanıcyı belirtmelisin", message.author, message.channel)
        await data.find({ user: user.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
            if(!res) return this.client.yolla(`${user} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)
            let datax = [
                ["ID", "Tarih", "Ceza", "Sebep"]
            ];

            let dataxe = [
                ["ID", "Ceza", "Tarih", "Bitiş", "Yetkili", "Sebep"]
            ];

            let config = {
                border: {
                    topBody: ``,
                    topJoin: ``,
                    topLeft: ``,
                    topRight: ``,

                    bottomBody: ``,
                    bottomJoin: ``,
                    bottomLeft: ``,
                    bottomRight: ``,

                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,

                    joinBody: ``,
                    joinLeft: ``,
                    joinRight: ``,
                    joinJoin: ``
                }
            };
            res.map(x => {
                datax.push([x.ihlal, x.tarih, x.ceza, x.sebep])
            })
            let cezaSayi = datax.length - 1
            if(cezaSayi == 0) return this.client.yolla(`${user} kullanıcısının ceza bilgisi bulunmuyor.`, message.author, message.channel)

            res.map(x => {
                dataxe.push([x.ihlal, x.ceza, x.tarih, x.bitiş, this.client.users.cache.get(x.yetkili).tag, x.sebep])
            })

            let out = table(dataxe, config)
            let outi = table(datax.slice(0, 15), config)

            
                const row = new Discord.MessageActionRow()
                .addComponents(
                  new Discord.MessageButton()
                    .setCustomId('CezaDosya')
                    .setLabel("Ceza Bilgi Dosyası")
                    .setEmoji("🚫")
                    .setStyle('PRIMARY'),
                  new Discord.MessageButton()
                    .setCustomId('CezaSayı')
                    .setLabel("Ceza Sayıları")
                    .setEmoji("❔")
                    .setStyle('PRIMARY'),
                  new Discord.MessageButton()
                    .setCustomId('CANCEL')
                    .setLabel("İptal")
                    .setStyle('DANGER'),
                );
                let msg = await message.channel.send({ components: [row], content: "<@" + user.id + "> kullanıcısının toplam " + cezaSayi + " cezası bulunmakta son 15 ceza aşağıda belirtilmiştir. Tüm ceza bilgi dosyasını indirmek için 🚫 emojisine, ceza sayılarına bakmak için ❔ emojisine basabilirsin.Tekli bir cezaya bakmak için `!ceza ID` komutunu uygulayınız. ```fix\n" + outi + "\n``` " })

                var filter = (button) => button.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

                collector.on('collect', async (button) => {
                    if (button.customId === "CezaDosya") {
                    row.components[0].setDisabled(true) 
                    msg.edit({ components: [row] }); 
                    button.reply({content: `${user} kullanıcısının toplam ${datax.length - 1} cezası aşağıdaki belgede yazmaktadır.`, ephemeral: true,  files: [{ attachment: Buffer.from(out), name: `${user.user.username}_cezalar.txt` }] })
                   
                } else if (button.customId === "CezaSayı") {
                    row.components[1].setDisabled(true) 
                    msg.edit({ components: [row] }); 
                    let filterArr = res.map(x => (x.ceza))
                    let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
                    let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
                    let jail = filterArr.filter(x => x == "Cezalı").length || 0
                    let ban = filterArr.filter(x => x == "Yasaklı").length || 0
                    let puan = await this.client.punishPoint(user.id)
                    button.reply({ content: "\`\`\`" + user.user.tag + " kullanıcısının ceza bilgileri aşağıda belirtilmiştir:\n\nChat Mute: " + chatMute + " kez.\nSes Mute: " + voiceMute + " kez.\nCezalı Bilgisi: "+ jail + " kez.\nBan Bilgisi: " + ban + " kez.\n\nKullanıcı toplamda " + cezaSayi + " kez kural ihlali yapmış, kullanıcının ceza puanı "+puan+".\`\`\`", ephemeral: true })
                    
                } else if (button.customId === "CANCEL") {
                    row.components[0].setDisabled(true) 
                    row.components[1].setDisabled(true) 
                    row.components[2].setDisabled(true) 
                    msg.edit({ components: [row] }); 
                    
                    button.reply({ content: "İşlem iptal edildi!", ephemeral: true })


                }
                })  
                collector.on('end', async (button, user) => {
                    row.components[0].setDisabled(true) 
                    row.components[1].setDisabled(true) 
                    row.components[2].setDisabled(true) 
                    msg.edit({ components: [row] }); 
                    
                })       
                })  
    }
}

module.exports = Cezalar;
