const Command = require("../../base/Command.js");
const Discord = require("discord.js")
let serverSettings = require("../../models/serverSettings");
class Voicekick extends Command {
    constructor(client) {
        super(client, {
            name: "Bağlantı-Kes",
            aliases: ["kes", "voicekick", "voice-kick", "at","bağlantıkes"]
        });
    }
    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.MoveAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Bağlantısını kesmek istediğin kullanıcıyı belirtmelisin!", message.author, message.channel)
        if(!user.voice.channel) return this.client.yolla("Bağlantısını kesmek istediğiniz kullanıcı sesli odalarda bulunmuyor.", message.author, message.channel)
        if(user.voice.channel.parentId !== server.RegisterParent) return this.client.yolla(`Yalnızca "V.Confirmed" odalarından birisinin bağlantısını kesebilirsiniz! Bu kullanıcı şu an "${user.voice.channel.name}" kanalında bulunmakta.`, message.author, message.channel)
       
        if(message.member.roles.highest.rawPosition < user.roles.highest.rawPosition) return this.client.yolla("Rolleri senden yüksek birinin ses kanallarında ki bağlantısını kesemezsin.", message.author, message.channel)
        const attımknk = new Discord.MessageEmbed()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setDescription("<@"+user+"> üyesi "+user.voice.channel.name+" ses kanalından çıkarıldı.")
        .setColor("RANDOM")
        user.voice.disconnect()
        message.channel.send({ embeds: [attımknk] }).then(message => { setTimeout(() => { message.delete(); }, 5000); }).then(m => message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)))
    }
}
    module.exports = Voicekick;