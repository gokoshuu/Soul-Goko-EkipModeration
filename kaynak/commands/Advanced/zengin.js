const Command = require("../../base/Command.js");
const Discord = require("discord.js")
let serverSettings = require("../../models/serverSettings");
class Booster extends Command {
    constructor(client) {
        super(client, {
            name: "booster-nick",
            aliases: ["bisim", "b-isim","zengin"]
        });
    }
 async run(message, args, data) {
    let server = await serverSettings.findOne({
        guildID: message.guild.id
    });
     if (!message.member.roles.cache.some(r => server.BoosterRole.includes(r.id))) return;
     let isim = args.slice().join(" ");
     if(!isim) return this.client.yolla("Kendi ismini ayarlamak için istediğin ismi belirtmen gerekiyor!", message.author, message.channel)
     let olmaz = /([^a-zA-ZIıİiÜüĞğŞşÖöÇç0-9 ]+)/gi;
     if (isim && (await this.client.chatKoruma(isim))) return this.client.yolla('Üyenin kullanıcı ismine reklam veya küfür yazamazsınız lütfen geçerli bir isim girip yeniden deneyiniz.', message.author, message.channel)
     if(isim.match(olmaz)) return this.client.yolla("Belirttiğin kullanıcı adında özel harfler bulunmaması gerekir lütfen tekrar dene!", message.author, message.channel)
     let banNum = this.client.boosterLimit.get(message.author.id) || 0
     this.client.boosterLimit.set(message.author.id, banNum + 1)
     if (banNum == 2) return this.client.yolla("Gün içerisinde çok fazla isim değiştirme işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
     try {
        const nicks = message.member.user.username.includes(server.Tag);
        if (nicks) await message.member.setNickname(`${server.Tag} ${isim}`);
        else await message.member.setNickname(`${server.SecondaryTag} ${isim}`);
        const başarılı = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription("Belirttiğin kullanıcı adı başarıyla değiştirilmiştir.")
        .setColor("RANDOM")
        message.channel.send({ embeds: [başarılı] }).then(message => { setTimeout(() => { message.delete(); }, 10000); }).catch(e => console.log(e)).then(m => message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)))
     } catch (error) {
         const hata = new Discord.MessageEmbed()
         .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
         .setDescription("Bir hata ile karşılaştım | **"+error+"**")
         .setColor("RANDOM")
         message.channel.send({ embeds: [hata] }).then(m => {setTimeout(() => { m.delete(); }, 1000);}).catch(e => console.log(e)).then(m => message.react(this.client.no))
     }
 }
}
module.exports = Booster;
