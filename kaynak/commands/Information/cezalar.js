const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
let serverSettings = require("../../models/serverSettings");
require("moment-duration-format")
moment.locale("tr")
const {table} = require('table');
const Discord = require("discord.js");
class Ceza extends Command {
    constructor(client) {
        super(client, {
            name: "ceza",
            aliases: ["ceza","ihlal"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return
        if(!args[0]) return this.client.yolla("Bir ceza numarası belirt ve tekrardan dene", message.author, message.channel)
       
        if(args && isNaN(args)) return this.client.yolla(`Sayı yazmalısın.`, message.author, message.channel)
        await data.findOne({ihlal: args[0]}, async (err, res) => {
            if(!res) return this.client.yolla("Belirttiğin numaralı ceza bilgisi bulunamadı.", message.author, message.channel)
            let user = message.guild.members.cache.get(res.user)
            let puan = await this.client.punishPoint(res.user)
            const embed = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            //.setThumbnail(user.user.displayAvatarURL({dynamic:true}))
          /*  .setDescription(""+message.guild.name+ " sunucusunda <@"+res.user+"> kişisine uygulanan "+res.ihlal+" numaralı ceza:" + "\n\n" + "**Ceza Bilgileri**"  + "```"+
"ID => "+ res.ihlal + "\n" +
"Ceza Puan => "+ puan + "\n" +
"Yetkili => "+ this.client.users.cache.get(res.yetkili).tag + "\n"+
"Ceza Türü => "+ res.ceza + "\n" +
"Ceza Sebebi => "+ res.sebep + "\n" +
"Ceza Başlangıç => "+ res.tarih+ "\n" +
"Ceza Bitiş => "  + res.bitiş + "```" + "\n"+"kullanıcın tüm cezalarına bakmak ve ceza dosyasını indirmek için \`!cezalar @Göko/ID\` komutunu kullanın. "
                
            )*/
            .setDescription(`${message.guild.name} sunucusunda <@${res.user}> kişisine uygulanan ${res.ihlal} numaralı ceza: \n **Ceza Bilgileri**
\`\`\`fix
ID - ${res.ihlal}
Ceza Puan - ${puan}
Yetkili - ${this.client.users.cache.get(res.yetkili).tag} 
Ceza Türü - ${res.ceza} 
Ceza Sebebi - ${res.sebep}
Ceza Başlangıç - ${res.tarih}
Ceza Bitiş - ${res.bitiş}\`\`\` 
kullanıcın tüm cezalarına bakmak ve ceza dosyasını indirmek için \`!cezalar @Göko/ID\` komutunu kullanın. 
`)
            .setColor("RANDOM")
            message.channel.send({ embeds: [embed] })
           
    })
    }
}

module.exports = Ceza;