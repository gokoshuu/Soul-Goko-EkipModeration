const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const notlar = require("../../models/notlar.js");
const { max } = require("moment");
let serverSettings = require("../../models/serverSettings");
class Sayı extends Command {
    constructor(client) {
        super(client, {
            name: "Sayı",
            aliases: ["sayı", "names"]
        });
    }
    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.GuildOwner.includes(message.author.id)) return
        let includes = args[0]
        if (!includes) return this.client.yolla("Lütfen bir kelime belirtip tekrar deneyin!", message.author, message.channel)
       
        const row = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('Listele')
            .setLabel("Listele")
            .setEmoji("👌")
            .setStyle('PRIMARY'),
          new Discord.MessageButton()
            .setCustomId('CANCEL')
            .setLabel("İptal")
            .setStyle('DANGER'),
        );
       
        if (message.guild.members.cache.filter(x => x.user.username.includes(includes)).size === 0) return this.client.yolla("Kullanıcıların adında belirttiğiniz (`"+includes+"`) kelimesinden bulunamadı!", message.author, message.channel)
        if (message.guild.members.cache.filter(x => x.user.username.includes(includes)).size > 500) return this.client.yolla("Kullanıcı adında `"+includes+"` bulunan kişi sayısı 500 ü geçtiği için gönderemiyorum.", message.author, message.channel)
        let msg = await message.channel.send({ content: `Kullanıcı adında \`${includes}\` kelimesi geçen toplamda ${message.guild.members.cache.filter(x => x.user.username.includes(includes)).size} kadar kişi bulunmakta. Tüm üyeleri görüntülemek istiyorsanız 👌 emojisine tıklayınız.\n\nTepkisizlik dahilinde işlem 30 saniye içerisinde iptal edilecektir.`, components: [row]})
        var filter = (button) => button.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

        collector.on('collect', async (button) => {
            if (button.customId === "Listele") {
            row.components[0].setDisabled(true) 
            msg.edit({ components: [row] }); 
           
            let includesOne = 1
            const throwns = `${this.client.users.cache.filter(x => x.tag.toLowerCase().includes(includes.toLowerCase())).map(x => `**${includesOne++}.** <@${x.id}> - (\`${x.id}\`)`).join("\n")}`
             button.reply(`Kullanıcı adında \`${includes}\` geçen kullanıcılar alt tarafta gösteriliyor.\n─────────────────\n ${throwns}`)
        } else if (button.customId === "CANCEL") {
            row.components[0].setDisabled(true) 
            row.components[1].setDisabled(true) 
            msg.edit({ components: [row] }); 
            button.reply("İşlem iptal edildi")
        }
    })
    collector.on('end', async (button) => {
        
        row.components[0].setDisabled(true) 
        row.components[1].setDisabled(true) 
        msg.edit({ components: [row] }); 
})
    }
}
    module.exports = Sayı;
