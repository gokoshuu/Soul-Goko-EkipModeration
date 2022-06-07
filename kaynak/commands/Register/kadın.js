const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const kayıtlar = require("../../models/kayıtlar.js")
const isimler = require("../../models/isimler.js")
const data = require("../../models/cezalar")
let serverSettings = require("../../models/serverSettings");
class Kadın extends Command {
    constructor(client) {
        super(client, {
            name: "Kadın",
            aliases: ["k", "kadın", "woman", "bayan", "karı"]
        });
    }
    
    async run(message, args, client) {
      let server = await serverSettings.findOne({
        guildID: message.guild.id
    });
		if (!message.member.roles.cache.some(r => server.RegisterAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
      if (!server.RegisterSystem) return message.channel.send(`
🔒 Kayıtlar bir yönetici tarafından __geçici bir süreliğine kapatılmıştır.__ Lütfen bu süreçte beklemede kalın. Anlayışla karşıladığınız için teşekkürler!`)
    if (!server.GenderRegister) return;
    let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
    if(!member) return this.client.yolla("Kaydetmek istediğiniz kullanıcıyı belirtip tekrar deneyin!", message.author, message.channel)
    const name = args.slice(1).filter(arg => isNaN(arg)).map(arg => arg[0].toUpperCase() + arg.slice(1).toLowerCase()).join(" ");
    if (!name) return this.client.yolla("Yeni ismi belirtin.", message.author, message.channel);
    if (name && (await this.client.chatKoruma(name))) return this.client.yolla('Üyenin kullanıcı ismine reklam veya küfür yazamazsınız lütfen geçerli bir isim girip yeniden deneyiniz.', message.author, message.channel)
    if(name.length > 30) return this.client.yolla("isim ya da yaş ile birlikte toplam 30 karakteri geçecek bir isim giremezsin.", message.author, message.channel)
    const age = args.slice(1).filter(arg => !isNaN(arg))[0] ?? undefined;
    if (!age || isNaN(age)) return this.client.yolla("Geçerli bir yaş belirtin.", message.author, message.channel);
    if (server && server.TaggedMode === true) {
      if(!member.user.username.includes(server.Tag) && !member.premiumSince && !member.roles.cache.has(server.VipRole)) return this.client.yolla("Şuanlık bu sunucuda sunucuda taglı alım mevcuttur ( "+server.Tag+" ) tagını alarak kayıt olabilirsin, bir süre sonra tagsız alıma geçildiğinde gelmeyi de tercih edebilirsin.", message.author, message.channel)
    }

    await data.find({ user: member.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {

    let filterArr = res.map(x => (x.ceza))
        let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
        let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
        let jail = filterArr.filter(x => x == "Cezalı").length || 0
        let ban = filterArr.filter(x => x == "Yasaklı").length || 0
        let warn = filterArr.filter(x => x == "Uyarı").length || 0
    let puan = await this.client.punishPoint(member.id)
    let cezasayı = await this.client.cezasayı(member.id)

    let durum;
    if(cezasayı < 5) durum = "Çok Güvenli";
    if(cezasayı >= 5 && cezasayı < 10) durum = "Güvenli";
    if(cezasayı >= 10 && cezasayı < 15) durum = "Şüpheli";
    if(cezasayı >= 15 && cezasayı < 20) durum = "Tehlikeli";
    if(cezasayı >= 20) durum = "Çok Tehlikeli";
    const cezasıvar = new Discord.MessageEmbed()
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
    .setDescription(`
🚫 ${member.toString()} kişisine toplam `+cezasayı+` kez cezai işlem uygulandığı için 
olduğu için kayıt işlemi iptal edildi. Sunucumuzda tüm 
işlemlerin kayıt altına alındığını unutmayın. Sorun Teşkil eden, 
sunucunun huzurunu bozan ve kurallara uymayan kullanıcılar 
sunucumuza kayıt olamazlar. 
Belirtilen üye toplamda ${ban} adet ban, ${jail} adet cezalı,
${chatMute} adet chat-mute, ${voiceMute} adet voice-mute, ${warn} adet uyarı olmak üzere toplam da ${cezasayı} ceza almış.
       
Eğer konu hakkında bir şikayetiniz var ise <@&${server.SeniorOfficial}>
rolü ve üstlerine ulaşabilirsiniz.
`)
    .setColor("RANDOM")
    if(cezasayı > 11  &&
      !message.member.roles.cache.some(role => message.guild.roles.cache.get(`${server.SeniorOfficial}`).rawPosition <= role.rawPosition)) {
        if(this.client.kayıtlar.has(message.author.id)) {
            this.client.kayıtlar.delete(message.author.id)
        }
        return message.channel.send({ embeds: [cezasıvar] })
    }
    if(member.roles.cache.has(server.ManRole[0]) || member.roles.cache.has(server.WomanRole[0])) {
        if(this.client.kayıtlar.has(message.author.id)) {
            this.client.kayıtlar.delete(message.author.id)
        }
        return this.client.yolla("<@"+member+"> kullanıcısı zaten sunucumuza kayıtlı olduğundan dolayı kayıt işlemi iptal edildi!", message.author, message.channel)
    }
    const newnick = `${member.user.username.includes(server.Tag) ? server.Tag : (server.SecondaryTag ? server.SecondaryTag : (server.SecondaryTag || ""))} ${name} | ${age}`;
    await member.setNickname(newnick);
    
    await kayıtlar.findOne({ user: message.author.id }, async (err, res) => {
        if (res) {
          if (res.kayıtlar.includes(member.id)) {
            res.kadın = res.kadın
            res.save().catch(e => console.log(e))
          } else {
            res.kayıtlar.push(member.id)
            res.kadın = res.kadın + 1
            res.toplam = res.toplam + 1
            res.save().catch(e => console.log(e))
          }
        } else if (!res) {
          let arr = []
          arr.push(member.id)
          const data = new kayıtlar({
            user: message.author.id,
            erkek: 0,
            kadın: 1,
            toplam: 1,
            kayıtlar: arr
          })
          data.save().catch(e => console.log(e))
        }
      })

     /* if(Ayar.TagliAlim) {
        setTimeout(() => {
          member.roles.set(this.client.config.roles.unregisterRoles)
        }, 2000)
        const embedd = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setColor("RANDOM")
        .setDescription(`${member.toString()} üyesinde tagımız olmadığı için tekrardan kayıt edilemedi.`)
        .setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"});
      message.channel.send({ embeds: [embedd] })
    } else*/
    if(!member.roles.cache.has(server.WomanRole[0])) {
        setTimeout(() => {
          member.roles.add(server.WomanRole)
        }, 2000)
        await member.roles.remove(server.UnregisteredRole)
        const embed = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setColor("RANDOM")
        .setDescription(`${member.toString()} üyesine ${server.WomanRole.map(x => `<@&${x}>`)} rolleri verildi.`)
        .setFooter({ text: "Üyenin ceza puanı "+puan+" (" + durum + ")"});
      message.channel.send({ embeds: [embed] })
          message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name))
        this.client.channels.cache.get(server.GeneralChat).send("<@"+member+"> adlı üye aramıza yeni katıldı bir hoş geldin diyelim ve senle birlikte topluluğumuz **"+message.guild.memberCount+"** kişi oldu!").then(msg => { setTimeout(() => { msg.delete(); }, 10000); })
        isimler.findOne({user: member.id}, async(err,res) => {
            if(!res) {
            let arr = []
            arr.push({isim: member.displayName, state: "<"+server.WomanRole.map(x => `<@&${x}>`)+"", yetkili: message.author.id})
            let newData = new isimler({ 
              user: member.id,
              isimler: arr
            })
            newData.save().catch(e => console.log(e))
          } else {
            res.isimler.push({isim: member.displayName, state: ""+server.WomanRole.map(x => `<@&${x}>`)+"", yetkili: message.author.id})
            res.save().catch(e => console.log(e))
          }
          })
    }
})
}
}

module.exports = Kadın;

