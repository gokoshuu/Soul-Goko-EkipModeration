const data = require("../models/chatmute.js")
let serverSettings = require("../models/serverSettings");

module.exports = client => {
setInterval(async () => {
    let muted = await data.find({
        "muted": true,
        "endDate": {
            $lte: Date.now()
        }
    })
 
    muted.forEach(async memberdata => {
        let server = await serverSettings.findOne({
   
        });
        let sunucu = client.guilds.cache.get(server.guildID)
        if (!sunucu) return;
        if(!sunucu.members.cache.has(memberdata.user)) {
            data.deleteOne({user: memberdata.user}, async (err) => {
                if(err){ console.log("Silinemedi.") }
            })
        } else {
        let member = sunucu.members.cache.get(memberdata.user)
        if (!member) return;
        member.roles.remove(server.ChatMuteRole)
        data.deleteOne({user: member.id}, async (err) => {
            if(err){ console.log("Silinemedi.") }
        })
        }
    });
}, 5000);
}