const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const notlar = require("../../models/notlar.js");
const { max } = require("moment");
let serverSettings = require("../../models/serverSettings");
class Sayı extends Command {
    constructor(client) {
        super(client, {
            name: "dağıtknk",
            aliases: ["dağıt", "dagit"]
        });
    }
    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.GuildOwner.includes(message.author.id)) return
        let voiceChannel = message.member.voice.channelId;
        if (!voiceChannel) return message.reply("Bir ses kanalında olmalısın!");
        let publicRooms = message.guild.channels.cache.filter(c => c.parentId === server.PublicParent && c.id !== `${server.AFKRoom}` && c.type === "GUILD_VOICE");
        [...message.member.voice.channel.members.values()].forEach((m, index) => {
          setTimeout(() => {
             if (m.voice.channelId !== voiceChannel) return;
             m.voice.setChannel(publicRooms.random().id);
          }, index*1000);
        });
        message.reply(`\`${message.member.voice.channel.name}\` ses kanalında bulunan üyeler public kanallara dağıtılmaya başlandı!`);
      
    }
}
    module.exports = Sayı;
