const data = require("../models/yasaklıtag.js")
let serverSettings = require("../models/serverSettings");


module.exports = class {
	constructor(client) {
	  this.client = client;
	}
  
	async run(old, nev) {
		let server = await serverSettings.findOne({
   
        });
		await data.findOne({ guild: this.client.config.guildID }, async (err, res) => {
		if (old.username !== nev.username) {
		let üye = this.client.guilds.cache.get(this.client.config.guildID).members.cache.get(nev.id)
		if (res.taglar.some(x => nev.username.includes(x)) == true && res.taglar.some(x => old.username.includes(x)) == false && !üye.roles.cache.has(server.BannedTagRole)) {
		  üye.roles.set(üye.roles.cache.has(server.BoosterRole) ? (server.BoosterRole, server.BannedTagRole) : server.BannedTagRole).catch(e => console.log(e))
		  üye.send("İsmine almış olduğun tag sunucumuzun yasaklı taglar listesinde bulunduğu için sunucumuza olan erişimin kesildi. İsmindeki yasaklı tagı çıkardığın zaman sunucumuza olan erişimin tekrardan aktif hale gelecektir.").catch(e => console.log(e))
		  this.client.channels.cache.get(server.BannedTagLog).send(`
${nev} üyesi sunucumuzda yasaklı taglar arasında bulunan taglardan birini aldı.

Önce: \`${old.tag}\` 
Sonra: \`${nev.tag}\``);
		} 
		if (res.taglar.some(x => nev.username.includes(x)) == false && üye.roles.cache.has(server.BannedTagRole) && res.taglar.some(x => old.username.includes(x)) == true) {
		  let üye = this.client.guilds.cache.get(this.client.config.guildID).members.cache.get(nev.id)
		  üye.send("Daha önceden ismine almış olduğun sunucumuzda yasaklı taglar listesinde bulunan tagı isminden çıkardığın için sunucumuza olan erişimin tekrardan aktif hale getirildi. Teyit kanallarına girip kayıt olabilirsin, iyi eğlenceler!").catch(e => console.log(e))
		  this.client.channels.cache.get(server.BannedTagLog).send(`
${nev} üyesi sunucumuzda yasaklı taglar arasında bulunan taglardan birini bıraktı.

Önce: \`${old.tag}\` 
Sonra: \`${nev.tag}\``)
		  üye.roles.set(üye.roles.cache.has(server.BoosterRole) ? (server.BoosterRole, server.UnregisteredRole[0]) : server.UnregisteredRole[0]).catch(e => console.log(e))
		}
	  }
	})
	}
  };