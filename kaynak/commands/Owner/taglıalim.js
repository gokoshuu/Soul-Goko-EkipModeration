const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıtlar.js")
let serverSettings = require("../../models/serverSettings");
class taglıalım extends Command {
    constructor(client) {
        super(client, {
            name: "taglıalım",
            aliases: ["taglıalım","taglialim","taglıalim","taglialım","taglı-alım"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.BotOwner.includes(message.author.id)) return
        let data = await serverSettings.findOne({ guildID: message.guild.id })
if (!args[0]) return this.client.yolla(`
Taglı alım modu şuan **${data.TaggedMode ? `Açık` : `kapalı`}**
${data.TaggedMode ? "Taglı alım modunu kapatmak için \`.taglıalım kapat\`" : "Taglı alım modunu açmak için \`.taglıalım aç\`"}
Unutma üye sayısı 5bin ve 5binden fazla olan bir sunucuda taglı alımı aktifleştiremezsin.
`, message.author, message.channel)

        switch (args[0]) {
            case "aç":
                if(message.guild.members.cache.size >= 5000) return this.client.yolla("5 bin üyeden fazla biye üye sayısına sahip olan sunucuda taglı alım modunu aktifleştiremezsin. Mevcut üye sayısı "+message.guild.members.cache.size+"", message.author, message.channel)
                if (data && data.TaggedMode === true) return this.client.yolla(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Taglı alım zaten açık!`, message.author, message.channel)
                data.TaggedMode = true;
                data.save();
                this.client.yolla(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Taglı alım modu başarıyla aktif edildi! Kayıtlı olup tagı olmayan kullanıcılar kayıtsıza atılacak. (Boost, Vip üyeler hariç)`, message.author, message.channel)
                break;
            case "kapat":
                if (data && data.TaggedMode === false) return this.client.yolla(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Taglı alım zaten kapalı!`, message.author, message.channel)
                data.TaggedMode = false;
                data.save();
                this.client.yolla(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Taglı alım modu başarıyla kapatıldı!`, message.author, message.channel)
                break;

        }
    }
}

module.exports = taglıalım;