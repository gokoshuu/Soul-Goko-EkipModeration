const Command = require("../../base/Command.js");
const Discord = require("discord.js");
let serverSettings = require("../../models/serverSettings");
class Unregister extends Command {
    constructor(client) {
        super(client, {
            name: "Unregister",
            aliases: ["unregister", "kayıtsız", "un-register","unreg","unregistered"]
        });
    }
    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if (!message.member.roles.cache.some(r => server.RegisterAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Kayıtsıza atmak istediğiniz kişiye belirtmeniz gerekmektedir.", message.author, message.channel)
        if(user.permissions.has("VIEW_AUDIT_LOG")) return this.client.yolla("Sunucumuzda yönetici olarak bulunan kişileri kayıtsıza atamazsınız.", message.author, message.channel)
        if(user.roles.cache.has(server.BotCommandRole) || user.roles.cache.has(server.BoosterRole)) return this.client.yolla("Sunucumuzda yetkili olarak bulunan ve ya sunucumuza takviye yapmış üyeleri kayıtsıza atamam.", message.author, message.channel)
        let banNum = this.client.unregisterLimit.get(message.author.id) || 0
        this.client.unregisterLimit.set(message.author.id, banNum + 1)
        if (banNum == 5) return this.client.yolla("Gün içerisinde çok fazla kayıtsız işlemi uyguladığınız için komut geçici olarak kullanımınıza kapatılmıştır.", message.author, message.channel)
        user.roles.cache.has(server.BoosterRole) ? user.roles.set([server.BoosterRole, server.UnregisteredRole[0]]) : user.roles.set([server.UnregisteredRole[0]])
        user.voice.disconnect()
        const görüşürüz = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setDescription("<@"+user+"> adlı kullanıcı sunucumuzda başarıyla kayıtsıza atılmıştır.")
        .setColor(message.member.displayHexColor)
        message.channel.send({ embeds: [görüşürüz] }).then(msg => { setTimeout(() => { msg.delete(); }, 5000); }).then(m => message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)));
    }
}
    module.exports = Unregister;