const Command = require("../../base/Command.js")
let serverSettings = require("../../models/serverSettings");
class Koruma extends Command {
    constructor(client) {
        super(client, {
            name: "Koruma",
            aliases: ["koruma"]
        });
    }

    async run(message, args, perm) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!message.member.permissions.has("ADMINISTRATOR")) return
        if(!args[0]) {
            message.guild.roles.cache.get(this.client.config.roles.Führer).setPermissions(0) // Führer
            message.guild.roles.cache.get(this.client.config.roles.Owner).setPermissions(0) // Owner
            message.guild.roles.cache.get(this.client.config.roles.Ceo).setPermissions(0) // CEO    
            message.guild.roles.cache.get(this.client.config.roles.Bael).setPermissions(0) // Bael
            message.guild.roles.cache.get(this.client.config.roles.Çiftyıldız).setPermissions(0) // Çift Yıldız
            message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.no_name)} Sunucumuzun tüm rolleri güvenlik açısından devre dışı bırakılmıştır.`)
        }
        if(args[0] == "kapat") {
            message.guild.roles.cache.get(this.client.config.roles.Führer).setPermissions(8)
            message.guild.roles.cache.get(this.client.config.roles.Owner).setPermissions(2684350149)
            message.guild.roles.cache.get(this.client.config.roles.Ceo).setPermissions(268436608)
            message.guild.roles.cache.get(this.client.config.roles.Bael).setPermissions(128)
            message.guild.roles.cache.get(this.client.config.roles.Çiftyıldız).setPermissions(128)
            message.channel.send(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} Sunucumuzun yönetici rolleri tekrardan aktif hale getirilmiştir.`)
        } 
    }
}

module.exports = Koruma;
