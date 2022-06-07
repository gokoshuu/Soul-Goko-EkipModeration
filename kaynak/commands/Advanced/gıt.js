const Discord = require("discord.js");
const Command = require("../../base/Command.js");
class Git extends Command {
    constructor(client) {
        super(client, {
            name: "git",
            aliases: ["go"]
        });
    }
    async run(message, args, data) {
        let kullanici = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!message.member.voice.channel) return this.client.yolla("Bir kullanıcının odasına gitmek için ilk önce kendiniz ses kanalına girmelisiniz.", message.author, message.channel)
        if(!kullanici) return this.client.yolla("Odasına gitmek istedğiniz kullanıcıyı belirtmeniz gerekir", message.author, message.channel)
        if(!kullanici.voice.channel) return this.client.yolla("Odasına gitmek istediğiniz kullanıcı ses kanallarında bulunmuyor", message.author, message.channel)
        if(message.member.voice.channel.id === kullanici.voice.channel.id) return this.client.yolla("Odasına gitmek istediğinizi kullanıcı ile aynı odada bulunuyorsunuz!", message.author, message.channel)
        if (kullanici.id == message.author.id) return this.client.yolla("Kullanıcılar kendilerine ceza-i işlem uygulayamaz.", message.author, message.channel)

        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setCustomId("GİT")
            .setLabel("GİT")
            .setStyle("SUCCESS"),
            new Discord.MessageButton()
            .setCustomId("GİTME")
            .setLabel("GİTME")
            .setStyle("PRIMARY"),
            new Discord.MessageButton()
            .setCustomId("İPTAL")
            .setLabel("İPTAL")
            .setStyle("DANGER")
        )
       
        let teklif = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription(`${message.author} adlı kullanıcı sizin sesli kanalınıza gelmek istiyor kabul ediyor musunuz?`)
        .setColor("RANDOM")
    
          let msg = await message.channel.send({ embeds: [teklif], components: [row] })

        var filter = (button) => button.user.id === kullanici.id;
        const collector = msg.createMessageComponentCollector({ filter, time: 30000 })
       
        collector.on("collect", async (button) => {
           
            if(button.customId === "GİT") {
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(true)
                row.components[2].setDisabled(true)
                msg.edit({ components: [row] })

        message.member.voice.setChannel(kullanici.voice.channel);
        button.reply(`Başarıyla ${message.member} kişisinin bulunduğu \`${message.member.voice.channel.name}\` isimli kanala gittiniz.`)
            
    } else if(button.customId === "GİTME") {
        row.components[0].setDisabled(true)
        row.components[1].setDisabled(true)
        row.components[2].setDisabled(true)
        msg.edit({ components: [row] })

        button.reply("Odaya çekilme işlemi iptal edildi.")
    } else if(button.customId === "İPTAL") {
        row.components[0].setDisabled(true)
        row.components[1].setDisabled(true)
        row.components[2].setDisabled(true)
        msg.edit({ components: [row] })

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
module.exports = Git;
