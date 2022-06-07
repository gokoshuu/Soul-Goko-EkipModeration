const Command = require("../../base/Command.js");
const Discord = require("discord.js");
let serverSettings = require("../../models/serverSettings");
class Rolsüzver extends Command {
    constructor(client) {
        super(client, {
            name: "Rolsüz-Ver",
            aliases: ["rolsüz"]
        });
    }
    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.BotOwner.includes(message.author.id)) return
        let rolsuz = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
        if(args[0] == "ver") {
            rolsuz.forEach(r => {
                r.roles.add(server.UnregisteredRole)
            })
            const zaa = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setDescription("Sunucuda role sahip olmayan **"+rolsuz.size+"** kişiye \"Kayıtsız\" rolünü verdim.")
            .setColor("RANDOM")
            message.channel.send({ embeds: [zaa]})
        } else if(!args[0]) {
            const can = new Discord.MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})
            .setDescription("Sunucuda role sahip olmayan toplam **"+rolsuz.size+"** kişi bulunmaktadır. Bu kişilere kayıtsıza rolü vermek için `!rolsüz ver` komutunu uygulamanız gerekiyor.")
            .setColor("RANDOM")
            message.channel.send({ embeds: [can] })
        }
    }
}
module.exports = Rolsüzver;