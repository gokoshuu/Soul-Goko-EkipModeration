const Command = require("../../base/Command.js");
let serverSettings = require("../../models/serverSettings");

class Yetkilisayy extends Command {
    constructor(client) {
        super(client, {
            name: "yetkilisay",
            aliases: ["ysay", "yetkili-say"]
        });
    }


    async run(message, args, level) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if (!message.member.permissions.has("ADMINISTRATOR")) return
        let roles = message.guild.roles.cache.get(`${server.BotCommandRole}`); 
        let üyeler = [...message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= roles.position && (uye.presence && uye.presence.status !== "offline") && !uye.voice.channel).values()]
         var filter = m => m.author.id === message.author.id && m.author.id !== client.user.id && !m.author.bot;
         if(üyeler.length == 0) return message.channel.send("çevrimiçi yetkili olup seste olmayan yetkili yok")
   
         message.channel.send(`Online olup seste olmayan <@&${roles.id}> rolündeki ve üzerinde ki yetkili sayısı: ${üyeler.length ?? 0} `)
            message.channel.send(``+ üyeler.map(x => "<@" + x.id + ">").join(",") + ``)
    }
}

module.exports = Yetkilisayy
