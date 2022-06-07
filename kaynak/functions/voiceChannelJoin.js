let serverSettings = require("../models/serverSettings");
module.exports = class {
    constructor (client) {
      this.client = client;
    }
  
    async run (member, channel) {
        let server = await serverSettings.findOne({
   
        });
        if (!server.StreamChannel.includes(channel.id)) return
        if (!member.displayName.includes("|")) return
        let memberAge = member.displayName.split("|")[1]
        if (isNaN(memberAge)) return
        if (memberAge < 18) {
            let warningCount = this.client.streamWarning.get(member.id) || 1
            this.client.streamWarning.set(member.id, warningCount + 1)
            this.client.channels.cache.get(server.StreamPunitiveLog).send(`
${member} üyesi 18 yaşından küçük olmasına rağmen \`${channel.name}\` +18 kanalına giriş yaptı ve sesten attım.`)
            if(member.voice.channel) {
                setTimeout(() => {
                    member.voice.disconnect()
                }, 5000)
            } 
            if (warningCount >= 3) {
                member.roles.add(server.StreamPunitiveRole)
                if(member.voice.channel) {
                    setTimeout(() => {
                        member.voice.disconnect()
                    }, 5000);
                }
                this.client.channels.cache.get(server.StreamPunitiveLog).send(`
${member} üyesi 18 yaşından küçük olmasına rağmen \`${channel.name}\` +18 kanalına 3. giriş yapmayı denedi. Kanaldan atıp, \`Streamer Cezalı\` rolü verdim.`)
            }
            setTimeout(() => {
                if (this.client.streamWarning.has(member.id)) {
                    this.client.streamWarning.delete(member.id)
                }
            }, 60000)
        }   
    }
}