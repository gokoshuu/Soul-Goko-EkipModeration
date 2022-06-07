const Command = require("../../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
let serverSettings = require("../../models/serverSettings");

class Eval extends Command {
  constructor (client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category:"System",
      usage: "eval <expression>",
      aliases: ["ev"]
    });
  }

  async run (message, args, perm) { 
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
    if(!server.BotOwner.includes(message.author.id)) return
    try {
      var evaled = clean(await eval(args.join(" ")));
      message.channel.send(
        `${evaled.replace(
          new RegExp(this.client.token, "g"),
          "Verdim tokeni hissettin mi kardeşim"
        )}`,
        { code: "js", split: true }
      );
    } catch (err) {
      message.channel.send(err, { code: "js", split: true });
    }
    function clean(text) {
      if (typeof text !== "string")
        text = require("util").inspect(text, { depth: 0 });
      text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
      return text;
    }
  }
}

module.exports = Eval;