const Command = require("../../base/Command.js");
let serverSettings = require("../../models/serverSettings");
class Uncmd extends Command {
    constructor(client) {
        super(client, {
            name: "uncmd",
            aliases: ["uncmd"]
        });
    }

    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
if(!server.GuildOwner.includes(message.author.id)) return
let victim = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
if(!victim) return this.client.yolla("Komut yasağını kaldırmak istediğin kullanıcıyı doğru şekilde belirt ve tekrar dene!", message.author, message.channel)
if(!this.client.blockedFromCommand.includes(victim.id)) return message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} **${victim.user.tag}** kullanıcısı komut yasaklaması listesinde bulunmuyor.`)
let cleanArray = this.client.blockedFromCommand.find(x => x === victim.id)
this.client.blockedFromCommand.splice(this.client.blockedFromCommand.indexOf(cleanArray), 1)
message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} **${victim.user.tag}** kullanıcısının komut yasağı kaldırıldı.`)
    }
}

module.exports = Uncmd;
