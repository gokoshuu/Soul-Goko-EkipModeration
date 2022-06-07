const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const roller = require("../../models/rollog.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

class Rollog2 extends Command {
    constructor(client) {
        super(client, {
            name: "rollog",
            usage: "",
            aliases: ["rol-log", "rollogs", "rol-logs"]
        });
    }

    async run(message, args, level) {
        if (!message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const Veri = await roller.findOne({ user: Member.id });
        if (!Veri) return this.client.yolla("<@" + Member.id + "> kişisinin rol bilgisi veritabanında bulunmadı.", message.author, message.channel)
        let page = 1;
        let rol = Veri.roller.sort((a, b) => b.tarih - a.tarih)
       // let liste = rol.map(x => `${x.state == "Ekleme" ? this.client.ok : this.client.no} Rol: <@&${x.rol}> Yetkili: <@${x.mod}>\nTarih: ${moment(x.tarih).format("LLL")}`)
       let liste = rol.map(x => `\`[${moment(x.tarih).format("LLL")}, ${x.state}]\` <@${x.mod}>: <@&${x.rol}>`)
       const cancık = new Discord.MessageEmbed().setDescription(`
${Member} kişisinin toplam da verilmiş-alınmış ${Veri.roller.length} rollere ait bilgisi bulunmakta, rollerin bilgileri aşağıda belirttim.

${liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join('\n')}`).setColor("RANDOM").setAuthor({ name: Member.user.tag, iconURL: Member.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${Member.id}` }) 
const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId('ÖncekiSayfa')
    .setLabel("Önceki Sayfa")
    .setEmoji("⬅️")
    .setStyle('PRIMARY'),
    new Discord.MessageButton()
    .setCustomId('CANCEL')
    .setLabel("İptal")
    .setStyle('DANGER'),      
  new Discord.MessageButton()
    .setCustomId('SonrakiSayfa')
    .setLabel("Sonraki Sayfa")
    .setEmoji("➡️")
    .setStyle('PRIMARY'),
);       
       var msg = await message.channel.send({ embeds: [cancık]})
       var filter = (button) => button.user.id === message.author.id;
       const collector = msg.createMessageComponentCollector({ filter, time: 30000 })

if (liste.length > 10) {

    msg.edit({components: [row]})
    collector.on('collect', async (button) => {
        if (button.customId === "SonrakiSayfa") {
            if (liste.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
            msg.edit({ components: [row] }); 
       
            page += 1;
            let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
            msg.edit({ embeds: [new Discord.MessageEmbed().setColor("RANDOM").setDescription(`
${Member} kişisinin toplam da verilmiş-alınmış ${Veri.roller.length} rollere ait bilgisi bulunmakta, rollerin bilgileri aşağıda belirttim.
            
${rollogVeri}`).setAuthor({ name: Member.user.tag, iconURL: Member.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${Member.id}` })]})
   
button.deferUpdate();

} else if (button.customId === "ÖncekiSayfa") {

        if (liste.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
        page -= 1;
        let rollogVeri = liste.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
        msg.edit({ embeds: [new Discord.MessageEmbed().setColor("RANDOM").setDescription(`${Member} kişisinin toplam da verilmiş-alınmış ${Veri.roller.length} rollere ait bilgisi bulunmakta, rollerin bilgileri aşağıda belirttim.
        
${rollogVeri}`).setAuthor({ name: Member.user.tag, iconURL: Member.user.displayAvatarURL({ dynamic: true }), url: `https://discord.com/users/${Member.id}` })]})

button.deferUpdate();

    } else if (button.customId === "CANCEL") {
        row.components[0].setDisabled(true) 
        row.components[1].setDisabled(true) 
        row.components[2].setDisabled(true) 
        msg.edit({ components: [row] }); 
        button.reply("İşlem iptal edildi.")

    }
})

collector.on("end", async (button) => {
    row.components[0].setDisabled(true) 
    row.components[1].setDisabled(true) 
    row.components[2].setDisabled(true) 
    msg.edit({ components: [row] }); 
})
   

        }
    }
}
module.exports = Rollog2;
