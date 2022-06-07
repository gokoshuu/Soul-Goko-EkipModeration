const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const db = require("../../models/cantUnBan.js");
const { schema } = require("../../models/cantUnBan.js");
let serverSettings = require("../../models/serverSettings");
class unban extends Command {
  constructor(client) {
    super(client, {
      name: "unban",
      usage: "erkek",
      aliases: ["unban" , "yasakkaldır"]
    });
  };
  async run(message, args, client) {
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
   const whoisuseridd = args[0]
   if (isNaN(whoisuseridd)) return this.client.yolla('Lütfen geçerli bir kullanıcı ID\'si giriniz.', message.author , message.channel)
   if (!message.member.roles.cache.some(r => server.BanAuth.includes(r.id)) && !message.member.permissions.has("ADMINISTRATOR")) return; 
    let sChannel = message.guild.channels.cache.find(c => c.id === server.UnbanLog)
   const member = await this.client.users.fetch(whoisuseridd)
   await db.findOne({ user: member.id }, async (err, doc) => {
    const fetchBans =  message.guild.bans.fetch()
    fetchBans.then(async (bans) => {
      let ban = await bans.find(a => a.user.id === member.id)
      if (!ban) {
         this.client.yolla('**'+member.tag+'** üyesi zaten sunucuda yasaklı değil.', message.author , message.channel)
         message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name))
        }
    else if(doc) {
      this.client.yolla('**'+member.tag+'** üyesinin yasağı <@'+doc.mod+'> yetkilisi tarafından açılmaz olarak işaretlendi.', message.author , message.channel)
      message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name))
    } else {
     message.guild.members.unban(member.id)
     this.client.yolla('**'+member.tag+'** üyesinin yasağı <@'+message.author.id+'> tarafından kaldırıldı.', message.author , message.channel)
     const embed = new Discord.MessageEmbed()
     .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true })})   
     .setColor("ff0000")
     .setDescription('**'+member.tag+'** üyesinin yasağı <@'+message.author.id+'> tarafından kaldırıldı.')
     sChannel.send({ embeds: [embed] })
     message.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name))
    }
  }) })
}
}
module.exports = unban;

