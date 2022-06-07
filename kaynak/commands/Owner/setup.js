const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const serverData = require('../../models/serverSettings')
const { max } = require("moment");
class Setup extends Command {
    constructor(client) {
        super(client, {
            name: "setup",
            aliases: ["kur"]
        });
    }
    async run(message, args, data) {

        if(!this.client.config.botOwners.includes(message.author.id)) return
        let choose = args[0]

        if(choose === "yardım") {
            let komutlarEmbed = new Discord.MessageEmbed()
  .addField(`
\`\`\`GUILD SETTINGS\`\`\``,`
!kur botowner @BotOwner
!kur guildowners @SunucuKurucuları
!kur tag Tag
!kur tag2 Tag
!kur tag3 Tag
!kur tag4 Tag
!kur tag5 Tag
!kur etiket Tag
!Kur secondarytag İkinciTag
!kur link SunucuLinki
`)//5
.addField(`
\`\`\`CHANNEL SETTINGS\`\`\``, `
!kur generalchat <#ChatKanalı>
!kur registerchat <#RegisterKanalı>
!kur registerlog <#RegisterLogKanalı>
!kur botvoicechannel <#BotVoiceChannel>
!kur rolyönetlog <#RolYönetLog>
!kur komutblocklog <#KomutBlokLog>
!kur joinfamilylog <#JoinFamilyLog>
!kur leavefamilylog <#LeaveFamilyLog>
!kur authleavelog <#YetkiliLeaveLog>
!kur voicemutelog <#VoiceMuteLog>
!kur removepunishment <#SağTıkCezaKaldırmaLog>
!kur bannedtaglog <#YasaklıTagLog>
!kur registerparent <#RegisterParent>
!kur publicparent <#PublicParent>
!kur banlog <#BanLog>
!kur jailLog <#JailLog>
!kur cezapuan <#CezaPuan>
!kur chatmutelog <#ChatMuteLog>
!kur unbanlog <#UnbanLog>
!kur sağtıkrollog <#SağTıkRolYönetLog>
!kur streampunitivelog <#StreamCezalıLog>
!kur streamchannels <#StreamKanalları>
!kur afkroom #AfkROOM
`)//21
.addField(`
\`\`\`ROLE SETTINGS\`\`\``,`
!kur kayıtsızrolü <@KayıtsızRolü>
!kur kadınrolü <@KadınRolü>
!kur erkekrolü <@ErkekRolü>
!kur viprolü <@VipRolü>
!kur boosterrolü <@BoosterRolü>
!kur yasaklıtagrolü <@YasaklıTagRolü>
!kur şüphelirolü <@ŞüpheliHesapRolü>
!kur familyrole <@TaglıRolü>
!kur chatmutedrole <@ChatMuteRolü>
!kur karantinarole <@CezalıRolü>
!kur adsrole <@ReklamcıRolü>
!kur warnroleone <@1.UyarıRolü>
!kur warnroletwo <@2.UyarıRolü>
!kur joinmeetrole <@KatıldıRolü>
!kur warnrolethree <@3.UyarıRolü>
!kur streampunitiverole <@StreamCezalıRolü>
`)//15
.addField(`
\`\`\`PERM SETTINGS\`\`\``, `
!kur registerauth <@RegisterSorumlusu>
!kur ustyetkili <@EnÜstYetkili>
!kur botcommandrole <@BotKomutRolü>
!kur moveauth <@TransportRolü>
!kur jailauth <@JailAuth>
!kur banauth <@BanAuth>
!kur chatmuteauth <@ChatMuteAuth>
!kur rolemanageauth <@RolManageAuth>
!kur voicemuteauth <@VoiceMuteAuth>
`)//9
            .setColor('00b5ff')
            message.channel.send({ embeds: [komutlarEmbed] })
                }

        if(!choose) {
            let ayar = await serverData.findOne({guildID: message.guild.id})
            let embed = new Discord.MessageEmbed()
            .setTitle(`Ayarlar`, message.author.avatarURL({dynamic: true}))
             .addField(`
\`\`\`BOT SETTINGS\`\`\``, `
**Bot-Owner:** (${ayar.BotOwner.length > 0 ? `${ayar.BotOwner.map(x => `<@${x}>`).join(",")}` : "\`YOK\`"})
**RegisterMode:** (${ayar.GenderRegister ? `.e @göko 17` : `.isim @göko 17 - .e`})
**RegisterSystem:** (${ayar.RegisterSystem ? `\`Açık\`` : `\`Kapalı\``})
**TaglıAlım:** (${ayar.TaggedMode ? `\`Açık\`` : `\`Kapalı\``})
`)
           .addField(`
\`\`\`SERVER SETTINGS\`\`\``, `
**GuildOwner:** (${ayar.GuildOwner.length > 0 ? `${ayar.GuildOwner.map(x => `<@${x}>`).join(",")}` : "\`YOK\`"})
**Tag:** (${ayar.Tag ? ayar.Tag : "\`YOK\`"})
**Tag2:** (${ayar.Tag2 ? ayar.Tag2 : "\`YOK\`"})
**Tag3:** (${ayar.Tag3 ? ayar.Tag3 : "\`YOK\`"})
**Tag4:** (${ayar.Tag4 ? ayar.Tag4 : "\`YOK\`"})
**Tag5:** (${ayar.Tag5 ? ayar.Tag5 : "\`YOK\`"})
**Etiket:** (${ayar.Etiket ? ayar.Etiket : "\`YOK\`"})
**Untag:** (${ayar.SecondaryTag ? ayar.SecondaryTag : "\`YOK\`"})
**Link:** (${ayar.Link ? ayar.Link : "\`YOK\`"})
`)
.addField(`
\`\`\`PERMISSIONS SETTINGS\`\`\``, `
**RegisterAuth:** (${ayar.RegisterAuth.length > 0 ? `${ayar.RegisterAuth.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**ÜstYetkili:** (${ayar.SeniorOfficial.length > 0 ? `${ayar.SeniorOfficial.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**BotCommandRole:** (${ayar.BotCommandRole.length > 0 ? `${ayar.BotCommandRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**BanAuth:** (${ayar.BanAuth.length > 0 ? `${ayar.BanAuth.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**JailAuth:** (${ayar.JailAuth.length > 0 ? `${ayar.JailAuth.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**ChatMuteAuth:** (${ayar.ChatMuteAuth.length > 0 ? `${ayar.ChatMuteAuth.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**VoiceMuteAuth:** (${ayar.VoiceMuteAuth.length > 0 ? `${ayar.VoiceMuteAuth.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**RoleManageAuth:** (${ayar.RoleManageAuth.length > 0 ? `${ayar.RoleManageAuth.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**MoveAuth:** (${ayar.MoveAuth.length > 0 ? `${ayar.MoveAuth.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
`)
.addField(`
\`\`\`ROLE SETTINGS\`\`\``, `
**Man-Role:** (${ayar.ManRole.length > 0 ? `${ayar.ManRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**Woman-Role:** (${ayar.WomanRole.length > 0 ? `${ayar.WomanRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**Unregistered-Role:** (${ayar.UnregisteredRole.length > 0 ? `${ayar.UnregisteredRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**Family-Role:** (${ayar.FamilyRole.length > 0 ? `${ayar.FamilyRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**Suspected-Role:** (${ayar.SuspectedRole.length > 0 ? `${ayar.SuspectedRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**BoosterRole:** (${ayar.BoosterRole.length > 0 ? `${ayar.BoosterRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**VipRole:** (${ayar.VipRole.length > 0 ? `${ayar.VipRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**KarantinaRole:** (${ayar.QuarantineRole.length > 0 ? `${ayar.QuarantineRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**ADSRole:** (${ayar.ADSRole.length > 0 ? `${ayar.ADSRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**ChatMuteRole:** (${ayar.ChatMuteRole.length > 0 ? `${ayar.ChatMuteRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**WarnRoleOne:** (${ayar.WarnRoleOne.length > 0 ? `${ayar.WarnRoleOne.map(x => `${x}`).join(",")}` : "\`YOK\`"})
**WarnRoleTwo:** (${ayar.WarnRoleTwo.length > 0 ? `${ayar.WarnRoleTwo.map(x => `${x}`).join(",")}` : "\`YOK\`"})
**WarnRoleThree:** (${ayar.WarnRoleThree.length > 0 ? `${ayar.WarnRoleThree.map(x => `${x}`).join(",")}` : "\`YOK\`"})
**BannedTagRole:** (${ayar.BannedTagRole.length > 0 ? `${ayar.BannedTagRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**JoinMeetingRole:** (${ayar.JoinMeetingRole.length > 0 ? `${ayar.JoinMeetingRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
**StreamPunitiveRole:** (${ayar.StreamPunitiveRole.length > 0 ? `${ayar.StreamPunitiveRole.map(x => `<@&${x}>`).join(",")}` : "\`YOK\`"})
`)
.addField(`
\`\`\`CHANNEL SETTINGS\`\`\``, `
**GeneralChat:** (${ayar.GeneralChat.length ? `<#${ayar.GeneralChat}>` : "\`YOK\`"})
**RegisterChat:** (${ayar.RegisterChat.length ? `<#${ayar.RegisterChat}>` : "\`YOK\`"})
**PublicParent:** (${ayar.PublicParent.length ? `<#${ayar.PublicParent}>` : "\`YOK\`"})
**RegisterParent:** (${ayar.RegisterParent.length ? `<#${ayar.RegisterParent}>` : "\`YOK\`"})
**BotVoiceChannel:** (${ayar.BotVoiceChannel.length ? `<#${ayar.BotVoiceChannel}>` : "\`YOK\`"})
**StreamChannel:** (${ayar.StreamChannel.length > 0 ? `${ayar.StreamChannel.map(x => `<#${x}>`).join(",")}` : "\`YOK\`"})
**AFKRoom:** (${ayar.AFKRoom.length ? `<#${ayar.AFKRoom}>` : "\`YOK\`"})
`)
.addField(`
\`\`\`LOG SETTINGS\`\`\``, `
**RegisterLog:** (${ayar.RegisterLog.length ? `<#${ayar.RegisterLog}>` : "\`YOK\`"})
**BanLog:** (${ayar.BanLog.length ? `<#${ayar.BanLog}>` : "\`YOK\`"})
**JailLog:** (${ayar.JailLog.length ? `<#${ayar.JailLog}>` : "\`YOK\`"})
**CezaPuanLog:** (${ayar.PenaltyPointLog.length ? `<#${ayar.PenaltyPointLog}>` : "\`YOK\`"})
**ChatMuteLog:** (${ayar.ChatMuteLog.length ? `<#${ayar.ChatMuteLog}>` : "\`YOK\`"})
**VoiceMuteLog:** (${ayar.VoiceMuteLog.length ? `<#${ayar.VoiceMuteLog}>` : "\`YOK\`"})
**UnbanLog:** (${ayar.UnbanLog.length ? `<#${ayar.UnbanLog}>` : "\`YOK\`"})
**SağTıkRolYönetLog:** (${ayar.RightClickRoleManageLog.length ? `<#${ayar.RightClickRoleManageLog}>` : "\`YOK\`"})
**KomutBlockLog:** (${ayar.CommandBlockLog.length ? `<#${ayar.CommandBlockLog}>` : "\`YOK\`"})
**RolYönetLog:** (${ayar.BotRoleManageLog.length ? `<#${ayar.BotRoleManageLog}>` : "\`YOK\`"})
**JoinFamilyLog:** (${ayar.JoinFamilyLog.length ? `<#${ayar.JoinFamilyLog}>` : "\`YOK\`"})
**LeaveFamilyLog:** (${ayar.LeaveFamilyLog.length ? `<#${ayar.LeaveFamilyLog}>` : "\`YOK\`"})
**AuthyLeaveLog:** (${ayar.AuthyLeaveLog.length ? `<#${ayar.AuthyLeaveLog}>` : "\`YOK\`"})
**RemovePunishmentLog:** (${ayar.RightClickRemovePunishmentLog.length ? `<#${ayar.RightClickRemovePunishmentLog}>` : "\`YOK\`"})
**BannedTagLog:** (${ayar.BannedTagLog.length ? `<#${ayar.BannedTagLog}>` : "\`YOK\`"})
**StreamPunitiveLog:** (${ayar.StreamPunitiveLog.length ? `<#${ayar.StreamPunitiveLog}>` : "\`YOK\`"})
`)
            .setColor('RANDOM')
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            message.channel.send({ embeds: [embed] })
        }

        
        let canzade = await serverData.findOne({guildID: message.guild.id})

        //#region Bot
        if (["botowner"].some(x => x === choose)) {
            let rol;
            if (message.mentions.users.size >= 1) {
                rol = message.mentions.users.map(r => r.id);
            } else {
                if (!rol) return this.client.yolla(`Bot ownerlarını belirtmelisin`, message.author, message.channel)
                rol = args.splice(0, 1).map(id => message.guild.users.cache.get(id)).filter(r => r != undefined);
            }
            canzade.BotOwner = rol, canzade.save(), this.client.yolla(`Bot ownerları başarıyla ${rol.map(x => `<@${x}>`)} olarak ayarlandı`, message.author, message.channel)
        };

        if (["registersystem"].some(x => x === choose)) {
           
            canzade.RegisterSystem = true, canzade.save(), this.client.yolla(`Register sistemi başarıyla aktif edildi!`, message.author, message.channel)
        };
//#endregion Bot

//#region Guild

        if (["guildowner"].some(x => x === choose)) {
            let rol;
            if (message.mentions.users.size >= 1) {
                rol = message.mentions.users.map(r => r.id);
            } else {
                if (!rol) return this.client.yolla(`Sunucunun ownerlarını belirtmelisin`, message.author, message.channel)
                rol = args.splice(0, 1).map(id => message.guild.users.cache.get(id)).filter(r => r != undefined);
            }
            canzade.GuildOwner = rol, canzade.save(), this.client.yolla(`Sunucunun ownerları başarıyla ${rol.map(x => `<@${x}>`)} olarak ayarlandı`, message.author, message.channel)
        };

        if (["tag"].some(x => x === choose)) {
            let select = args[1];
            if (!select) return this.client.yolla(`Sunucunun tagını belirtmelisin`, message.author, message.channel)
            canzade.Tag = select, canzade.save(), this.client.yolla(`Sunucu tagı başarıyla ${select} olarak ayarlandı`, message.author, message.channel)
        };
        if (["tag2"].some(x => x === choose)) {
            let select = args[1];
            if (!select) return this.client.yolla(`Sunucunun tagını belirtmelisin`, message.author, message.channel)
            canzade.Tag2 = select, canzade.save(), this.client.yolla(`Sunucu tagı başarıyla ${select} olarak ayarlandı`, message.author, message.channel)
        };
        if (["tag3"].some(x => x === choose)) {
            let select = args[1];
            if (!select) return this.client.yolla(`Sunucunun tagını belirtmelisin`, message.author, message.channel)
            canzade.Tag3 = select, canzade.save(), this.client.yolla(`Sunucu tagı başarıyla ${select} olarak ayarlandı`, message.author, message.channel)
        };
        if (["tag4"].some(x => x === choose)) {
            let select = args[1];
            if (!select) return this.client.yolla(`Sunucunun tagını belirtmelisin`, message.author, message.channel)
            canzade.Tag4 = select, canzade.save(), this.client.yolla(`Sunucu tagı başarıyla ${select} olarak ayarlandı`, message.author, message.channel)
        };
        if (["tag5"].some(x => x === choose)) {
            let select = args[1];
            if (!select) return this.client.yolla(`Sunucunun tagını belirtmelisin`, message.author, message.channel)
            canzade.Tag5 = select, canzade.save(), this.client.yolla(`Sunucu tagı başarıyla ${select} olarak ayarlandı`, message.author, message.channel)
        };
        if (["etiket"].some(x => x === choose)) {
            let select = args[1];
            if (!select) return this.client.yolla(`Sunucunun tagını belirtmelisin`, message.author, message.channel)
            canzade.Etiket = select, canzade.save(), this.client.yolla(`Sunucu tagı başarıyla ${select} olarak ayarlandı`, message.author, message.channel)
        };

        if (["secondarytag", "secondary-tag", "ikincitag"].some(x => x === choose)) {
            let select = args[1];
            if (!select) return this.client.yolla(`Sunucunun ikinci tagını belirtmelisin`, message.author, message.channel)
            canzade.SecondaryTag = select, canzade.save(), this.client.yolla(`Sunucu ikinci tagı başarıyla ${select} olarak ayarlandı`, message.author, message.channel)
        };

        if (["link"].some(x => x === choose)) {
            let select = args[1];
            if (!select) return this.client.yolla(`Sunucunun linkini belirtmelisin`, message.author, message.channel)
            canzade.Link = select, canzade.save(), this.client.yolla(`Sunucunu linki başarıyla ${select} olarak ayarlandı`, message.author, message.channel)
        };

//#endregion Guild

//#region Permissions

if(["registerauth","kayıtyetkili"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu register komut yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.RegisterAuth = rol, await canzade.save() 
    this.client.yolla(`Sunucu register komut yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["ustyetkili","üstyetkili"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu üst yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.SeniorOfficial = rol, await canzade.save() 
    this.client.yolla(`Sunucu üst yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["botcommandrole","botcommandsrole"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu bot komut yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.BotCommandRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu bot komut yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["banauth"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu ban yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.BanAuth = rol, await canzade.save() 
    this.client.yolla(`Sunucu ban yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["jailauth"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu jail yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.JailAuth = rol, await canzade.save() 
    this.client.yolla(`Sunucu jail yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["chatmuteauth"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu chat mute yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.ChatMuteAuth = rol, await canzade.save() 
    this.client.yolla(`Sunucu chat mute yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}


if(["voicemuteauth"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu voicemute yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.VoiceMuteAuth = rol, await canzade.save() 
    this.client.yolla(`Sunucu voicemute yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["rolemanageauth"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu yol yönet yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.RoleManageAuth = rol, await canzade.save() 
    this.client.yolla(`Sunucu rol yönet yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["moveauth"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu transport yetkili rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.MoveAuth = rol, await canzade.save() 
    this.client.yolla(`Sunucu transport yetkilisi başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}


//#endregion Permissions


//#region Role

if(["manrole","erkekrolü","erkekrol"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu erkek rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.ManRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu erkek rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["womanrole","kadınrolü","kadınrol"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu kadın rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.WomanRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu kadın rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["kayıtsızrolü","unregisteredrole","unregisterrole"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu kayıtsız rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
     canzade.UnregisteredRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu kayıtsız rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}


if(["familyrole","taglırolü","tagrolü"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu family rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.FamilyRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu family rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["şüphelirolü","suspectedrole","suspectrole","şüphelirol"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu şüpheli rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.SuspectedRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu şüpheli rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["boosterrolü","boosterrole","booster"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu booster rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.BoosterRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu booster rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}


if(["viprolü","vip","viprole"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu vip rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.VipRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu vip rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["karantinarolü","karantinarole","cezalırolü"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu karantina rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.QuarantineRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu karantina rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["adsrole"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu reklam rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.ADSRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu reklam rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["chatmuterole","chatmutedrole"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu chat mute rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.ChatMuteRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu chat mute rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["warnrole"].some(x => x === choose)) {
   let rol1 = args[1];
   let rol2 = args[2];
   let rol3 = args[3];
    canzade.WarnRoleOne = rol1, await canzade.save() 
    this.client.yolla(`Sunucu Warn rolü başarıyla ${args.map(x => `${x}`)} olarak ayarlandı`, message.author, message.channel)
}

if(["warnroletwo"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu 2. Warn rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.WarnRoleTwo = rol, await canzade.save() 
    this.client.yolla(`Sunucu 2. Warn rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["warnrolethree"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu 3. Warn rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.WarnRoleThree = rol, await canzade.save() 
    this.client.yolla(`Sunucu 3. Warn rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["yasaklıtagrole","yasaklıtagrole","bannedtagrol","yasaklıtagrolü","bannedtagrole"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu yasaklı tag rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.BannedTagRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu yasaklı tag rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}


if(["joinmeetrole","katıldırolü"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu katıldı rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.JoinMeetingRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu katıldı rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}

if(["streampunitiverole"].some(x => x === choose)) {
    let rol;
    if (message.mentions.roles.size >= 1) {
        rol = message.mentions.roles.map(r => r.id);
    } else {
        if (!rol) return this.client.yolla(`Sunucu streampunitive rolünü belirtmelisin`, message.author, message.channel)
        rol = args.splice(0, 1).map(id => message.guild.roles.cache.get(id)).filter(r => r != undefined);
    }
    canzade.StreamPunitiveRole = rol, await canzade.save() 
    this.client.yolla(`Sunucu streampunitive rolü başarıyla ${rol.map(x => `<@&${x}>`)} olarak ayarlandı`, message.author, message.channel)
}
//#endregion Role


//#region Channel

        if(["generalchat","chatkanalı","chatkanali","genelchat"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu genel chatini belirtmelisin`, message.author, message.channel)
            canzade.GeneralChat = log.id, await canzade.save(), this.client.yolla(`Sunucu genel chati başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["registerchat", "teyitchat","teyitkanal"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu register chatini belirtmelisin`, message.author, message.channel)
            canzade.RegisterChat = log.id, await canzade.save(),
            this.client.yolla(`Sunucu register chati başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["botvoicechannel", "botses","botseskanalı","botseskanali"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu bot ses kanalını belirtmelisin`, message.author, message.channel)
            canzade.BotVoiceChannel = log.id, await canzade.save(),
            this.client.yolla(`Sunucu bot ses kanalı başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["registerparent"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu register parent belirtmelisin`, message.author, message.channel)
            canzade.RegisterParent = log.id, await canzade.save(),
            this.client.yolla(`Sunucu register parent başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["publicparent"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu public parent belirtmelisin`, message.author, message.channel)
            canzade.PublicParent = log.id, await canzade.save(),
            this.client.yolla(`Sunucu public parent başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["streamchannels","streamchannel"].some(x => x === choose)) {
            let rol;
            if (message.mentions.channels.size >= 1) {
                rol = message.mentions.channels.map(r => r.id);
            } else {
                if (!rol) return this.client.yolla(`Sunucu stream kanallarını belirtmelisin`, message.author, message.channel)
                rol = args.splice(0, 1).map(id => message.guild.channels.cache.get(id)).filter(r => r != undefined);
            }
             canzade.StreamChannel = rol, await canzade.save() 
            this.client.yolla(`Sunucu stream kanallarını başarıyla ${rol.map(x => `<#${x}>`)} olarak ayarlandı`, message.author, message.channel)
        }
        
        if(["afk","afkkanal","afkchannel","afkroom"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu afk kanalını belirtmelisin`, message.author, message.channel)
            canzade.AFKRoom = log.id, await canzade.save(),
            this.client.yolla(`Sunucu afk kanalı başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        //#endregion Channel

        //#region Log

        if(["registerlog", "teyitlog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu register logunu belirtmelisin`, message.author, message.channel)
            canzade.RegisterLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu register logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };


        if(["banlog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu ban log belirtmelisin`, message.author, message.channel)
            canzade.BanLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu ban logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["jaillog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu jail log belirtmelisin`, message.author, message.channel)
            canzade.JailLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu jail logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        
        if(["cezapuan"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu cezapuan log belirtmelisin`, message.author, message.channel)
            canzade.PenaltyPointLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu cezapuan logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["chatmutelog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu chat mute log belirtmelisin`, message.author, message.channel)
            canzade.ChatMuteLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu chat mute logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        
        if(["voicemutelog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu VoiceMuteLog logunu belirtmelisin`, message.author, message.channel)
            canzade.VoiceMuteLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu VoiceMuteLog logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["unbanlog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu unban log belirtmelisin`, message.author, message.channel)
            canzade.UnbanLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu unban logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["sağtıkrolelog","sağtıkrollog","sagtikrollog","sağtıkrolyönetlog", "sagtikroleyönetlog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu sağ tık rol yönet logunu belirtmelisin`, message.author, message.channel)
            canzade.RightClickRoleManageLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu sağ tık rol yönet logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["komutblocklog","commandblocklog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu komut cezasına düşünce komut block logunu belirtmelisin`, message.author, message.channel)
            canzade.CommandBlockLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu komut cezasına düşünce komut block logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };


        if(["rolyönetlog", "rolemanagelog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu rol yönetme logunu belirtmelisin`, message.author, message.channel)
            canzade.BotRoleManageLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu rol yönetme logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };


        if(["joinfamilylog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu JoinFamily logunu belirtmelisin`, message.author, message.channel)
            canzade.JoinFamilyLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu JoinFamily logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["leavefamilylog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu LeaveFamilyLog logunu belirtmelisin`, message.author, message.channel)
            canzade.LeaveFamilyLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu LeaveFamilyLog logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };


        if(["authyleavelog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu AuthyLeaveLog logunu belirtmelisin`, message.author, message.channel)
            canzade.AuthyLeaveLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu AuthyLeaveLog logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["removepunishment"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu RemovePunishment logunu belirtmelisin`, message.author, message.channel)
            canzade.RightClickRemovePunishmentLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu RemovePunishment logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["bannedtaglog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu BannedTagLog logunu belirtmelisin`, message.author, message.channel)
            canzade.BannedTagLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu BannedTagLog logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };

        if(["streampunitivelog"].some(x => x === choose)) {
            let log = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
            if (!log) return this.client.yolla(`Sunucu streampunitive logunu belirtmelisin`, message.author, message.channel)
            canzade.StreamPunitiveLog = log.id, await canzade.save(),
            this.client.yolla(`Sunucu streampunitive logu başarıyla ${log} olarak ayarlandı`, message.author, message.channel)
        };



      
    }
}

    module.exports = Setup;
