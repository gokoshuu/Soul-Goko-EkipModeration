const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")
const ceza = require("../../models/cezalar.js")
let serverSettings = require("../../models/serverSettings");
const moment = require("moment")
require("moment-duration-format")
class Af extends Command {
  constructor(client) {
    super(client, {
      name: "af",
      usage: "erkek",
      aliases: ["unslave", "cezalı-af", "unjail"]
    });
  }

  async run(message, args, level) {
    let server = await serverSettings.findOne({
      guildID: message.guild.id
  });
		if (!message.member.roles.cache.some(r => server.JailAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
      let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
      if (!user) return this.client.yolla("Cezalısını kaldırmak istediğin kullanıcıyı belirt.", message.author, message.channel)
      await cezalar.findOne({ user: user.id }, async (err, doc) => {
          if (!doc) return this.client.yolla("<@" + user + "> veritabanında cezalı olarak bulunmuyor.", message.author, message.channel)
          if (doc.ceza == false) return this.client.yolla("<@" + user + "> veritabanında cezalı olarak bulunmuyor.", message.author, message.channel)
         doc.delete().catch(e => console.log(e))
         user.roles.cache.has(server.BoosterRole) ? user.roles.set([server.BoosterRole, server.UnregisteredRole[0]]) : user.roles.set(server.UnregisteredRole)
         this.client.yolla("Veritabanındaki <@" + user + "> kişinin cezası kaldırıldı.", message.author, message.channel)
    })
  }
}

module.exports = Af;
