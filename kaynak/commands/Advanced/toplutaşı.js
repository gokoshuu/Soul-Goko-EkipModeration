const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const Discord = require("discord.js")
const mutes = require("../../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class TopluTaşı extends Command {
    constructor(client) {
        super(client, {
            name: "toplu-taşı",
            aliases: ["toplutaşı", "ttaşı"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.permissions.has("MANAGE_ROLES")) return;
        if(!message.member.voice.channel) return this.client.yolla("Toplu taşıma işlemi uygulamadan önce bir ses kanalına bağlı olmalısın !", message.author, message.channel)
        let channelone = message.guild.channels.cache.find(a => a.type === "GUILD_VOICE" && a.id === args[0])
        let channeltwo = message.guild.channels.cache.find(a => a.type === "GUILD_VOICE" && a.id === args[1])
        if(!channelone) return this.client.yolla("Hangi kanaldaki üyeleri toplu taşımak istiyorsun", message.author, message.channel)
        if(!channeltwo) return this.client.yolla("Üyeleri hangi kanala taşımak istiyorsun", message.author, message.channel)
        if(channelone.length < 1) return this.client.yolla("Taşımak istediğiniz kanalda hiç üye olmadığı için işlem iptal edildi.", message.author, message.channel)
        channelone.members.map(a => { 
            a.voice.setChannel(channeltwo.id)
        })
        await this.client.yolla(`**${message.member.voice.channel.name}** kanalındaki üyeler **${channeltwo.name}** kanalına taşındı`, message.author, message.channel)
        message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name))
    }
}

module.exports = TopluTaşı;
