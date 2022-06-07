const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
let serverSettings = require("../../models/serverSettings");
class TopluBan extends Command {
    constructor(client) {
        super(client, {
            name: "topluban",
            usage: ".topluban [userID'ler]",
            category: "BotOwner",
            description: "Toplu ban atmanıza yarar.",
            aliases: ["topluban"]
        });
    }

    async run(message, args, client) {
        let server = await serverSettings.findOne({
            guildID: message.guild.id
        });
        if(!server.BotOwner.includes(message.author.id)) return
        if (args.length < 1)
        return message.channel.send(
            "Banlanacak kişilerin ID'lerini belirt.",
        );
    const members = args
        .filter((id) => message.guild.members.cache.has(id))
        .map((id) => message.guild.member(id));
    if (members.length < 1)
        return message.channel.send(
            "Sadece ID ile ban atabilirsin",
        );
        
    const prompt = await message.channel.send(
        `${members
            .map((member, idx) => `**${idx + 1}. ${member.toString()}**`)
            .join("\n")}\nBu üyeleri banlamak istiyor musun?`,
    );
    await prompt.react(this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name));
    const collector = prompt.createReactionCollector(
        (reaction, user) =>
            reaction.emoji.name === this.client.config.emojis.yes_name && user.id === message.author.id,
        { time: 1000 * 10 },
    );

    collector.on("collect", async () => {
        await prompt.edit(`${this.client.emojis.cache.find(x => x.name === this.client.config.emojis.yes_name)} ${members.length} adet kullanıcı başarıyla yasaklandı.`);
        for (const member of members) {
            if (member.bannable)
                await member.ban({ days: 7, reason: "Toplu ban" });
        }
        collector.stop();
    });

    collector.on("end", (_, reason) => {
        console.log("end", reason);
        if (reason === "time")
            prompt.edit("10 saniye geçtiği için işlem iptal edildi.");
    });
    }
}



module.exports = TopluBan;