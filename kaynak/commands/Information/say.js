const Command = require("../../base/Command.js");
const Discord = require("discord.js");
let serverSettings = require("../../models/serverSettings");
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "Say",
            aliases: ["say"]
        });
    }
    async run(message, args, data) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!message.member.permissions.has("MANAGE_ROLES")) return;
        let Meriaz1 = await message.guild.members.cache.filter(member => member.user.username.includes(server.Tag)).size;
    let Meriaz3 = await message.guild.members.cache.filter(member => member.user.username.includes(server.Tag2)).size;
    let Meriaz4 = await message.guild.members.cache.filter(member => member.user.username.includes(server.Tag3)).size;
    let Meriaz5 = await message.guild.members.cache.filter(member => member.user.username.includes(server.Tag4)).size;
    let Meriaz6 = await message.guild.members.cache.filter(member => member.user.username.includes(server.Tag5)).size;
    var Meriaz7 = message.guild.members.cache.filter(u => u.user.discriminator.includes(server.Etiket)).size;


    let Meriazzzz = Meriaz1 + Meriaz3 + Meriaz4 + Meriaz5 + Meriaz6 + Meriaz7

        let ses = message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").map(channel => channel.members.filter(member => !member.user.bot).size).reduce((a, b) => a + b);
        let bot = message.guild.channels.cache.filter(channel => channel.type == "GUILD_VOICE").map(channel => channel.members.filter(member => member.user.bot).size).reduce((a, b) => a + b);
        let members = message.guild.members.cache.size
        let boost = message.guild.premiumSubscriptionCount || "Sunucuda boost takviyesi bulunmamakta."
        let online = message.guild.members.cache.filter(m => (m.presence && m.presence.status !== "offline")).size
        
        let embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription("`•` Seste toplam **"+ses+ " (+"+bot+" bot)** kullanıcı var.\n`•` Toplam **"+Meriazzzz+"** kişi tagımıza sahip.\n`•` Sunucumuzda toplam **"+members+"** üye var.\n`•` Sunucumuza toplam **"+boost+"** takviye yapılmış.\n`•` Sunucumuzda toplam **"+online+"** çevrimiçi üye var.")
        message.channel.send({ embeds: [embed] }).then(m => message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)));    
    }
}
    module.exports = Say;
