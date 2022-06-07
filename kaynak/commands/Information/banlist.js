const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
let serverSettings = require("../../models/serverSettings");
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class BanList extends Command {
    constructor(client) {
        super(client, {
            name: "ban-list",
            aliases: ["banlist"]
        });
    }

    async run(message, args, client) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
		if (!message.member.roles.cache.some(r => server.BanAuth.includes(r.id)) && !message.member.permissions.has("VIEW_AUDIT_LOG")) return;
        const fetchBans = message.guild.bans.fetch()
        fetchBans.then(banned => {
            let list = banned.map(user => `${user.user.id} | ${user.user.tag}`).join('\n');
            message.channel.send(`\`\`\`js
${list}\n\nSunucumuzda toplam ${banned.size} yasaklı kullanıcı bulunmakta. Kişilerin ban nedenlerini öğrenmek icin !banbilgi ID komutunu uygulamalısın.\`\`\``)

        })
    }
}

module.exports = BanList;
