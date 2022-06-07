const Command = require("../../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
let serverSettings = require("../../models/serverSettings");

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "reload",
      description: "Evaluates arbitrary Javascript.",
      category:"System",
      usage: "eval <expression>",
      aliases: ["reload", "reboot"]
    });
  }

  async run (message, args, perm) { 
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
    if(!server.BotOwner.includes(message.author.id)) return
   /* if(params[0]) {
        let commandName  = params[0].toLowerCase()
        try {
          delete require.cache[require.resolve(`./${commandName}.js`)]
          client.commands.delete(commandName)
          const pull = require(`./${commandName}.js`)
          client.commands.set(commandName, pull)
        } catch(e) {
          return message.channel.send(`Bir hata oluştu ve **${commandName}** adlı komut reloadlanamadı.`)
        }
    
        message.channel.send(`__**${commandName}**__ adlı komut yeniden başlatılıyor!`).then(x => {setTimeout(() => { x.delete(); }, 5000);}).catch(() => { })
    
       return
      }*/
      message.channel.send(`__**Göko Junior**__ Küllerinden yeniden doğuyor!`).then(msg => {
        console.log('[BOT] Yeniden başlatılıyor...')
        process.exit(0);


      });
    
  }
}

module.exports = Eval;