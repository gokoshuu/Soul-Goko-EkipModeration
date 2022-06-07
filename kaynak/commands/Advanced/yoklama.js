const Command = require("../../base/Command.js");
const Discord = require("discord.js");
let serverSettings = require("../../models/serverSettings");
class Toplantı extends Command {
    constructor(client) {
        super(client, {
            name: "yoklama",
            aliases: ["yoklama","katıldı"]
        });
    }

    async run(message, args, level) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if (!message.member.permissions.has("MANAGE_ROLES")) return;
        message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Odadaki yetkililere katıldı permi veriliyor. Bu işlem uzun sürebilir.`)
        let toplantıdaOlanlarx = message.member.voice.channel.members.filter(x => {
            return !x.roles.cache.has(server.JoinMeetingRole)
        }).map(x => x.id)
        for (let i = 0; i < toplantıdaOlanlarx.length; i++) {
            setTimeout(() => {
                message.guild.members.cache.get(toplantıdaOlanlarx[i]).roles.add(server.JoinMeetingRole)
            }, (i + 1) * 1000)
        }
        message.channel.send("Odadaki tüm yetkililere katıldı permi başarıyla verildi.")

    }
}
module.exports = Toplantı