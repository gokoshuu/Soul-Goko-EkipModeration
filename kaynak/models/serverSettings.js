let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let serverSettings = Schema({

// BOT 

BotOwner: {
    type: Array,
    default: []
},

GenderRegister: {
    type: Boolean
},

RegisterSystem: {
    type: Boolean
},

TaggedMode: {
    type: Boolean
},

// GUILD

guildID: {
    type: String,
    default: ""
},

guildID2: {
    type: String,
    default: ""
},
GuildOwner: {
    type: Array,
    default: []
},

Tag: {
    type: String,
    default: ""
},
Tag2: {
    type: String,
    default: ""
},
Tag3: {
    type: String,
    default: ""
},
Tag4: {
    type: String,
    default: ""
},
Tag5: {
    type: String,
    default: ""
},
Etiket: {
    type: String,
    default: ""
},
SecondaryTag: {
    type: String,
    default: ""
},

Link: {
    type: String,
    default: ""
},


// PERMISSION

RegisterAuth: {
    type: Array,
    default: []
},

SeniorOfficial: {
    type: Array,
    default: []
},

BotCommandRole: {
    type: Array,
    default: []
},

BanAuth: {
    type: Array,
    default: []
},

JailAuth: {
    type: Array,
    default: []
},

ChatMuteAuth: {
    type: Array,
    default: []
},

VoiceMuteAuth: {
    type: Array,
    default: []
},

RoleManageAuth: {
    type: Array,
    default: []
},

MoveAuth: {
    type: Array,
    default: []
},


// ROLE

ManRole: {
    type: Array,
    default: []
},

WomanRole: {
    type: Array,
    default: []
},

UnregisteredRole: {
    type: Array,
    default: []
},

FamilyRole: {
    type: Array,
    default: []
},

SuspectedRole: {
    type: Array,
    default: []
},

BoosterRole: {
    type: Array,
    default: []
},

VipRole: {
    type: Array,
    default: []
},

QuarantineRole: {
    type: Array,
    default: []
},

ADSRole: {
    type: Array,
    default: []
},

ChatMuteRole: {
    type: Array,
    default: []
},

WarnRoleOne: {
    type: Array,
    default: []
},

WarnRoleTwo: {
    type: Array,
    default: []
},

WarnRoleThree: {
    type: Array,
    default: []
},

BannedTagRole: {
    type: Array,
    default: []
},

JoinMeetingRole: {
    type: Array,
    default: []
},

StreamPunitiveRole: {
    type: Array,
    default: []
},


// CHANNEL

GeneralChat: {
    type: String,
    default: ""
},

RegisterChat: {
    type: String,
    default: ""
},

PublicParent: {
    type: String,
    default: ""
},

RegisterParent: {
    type: String,
    default: ""
},

BotVoiceChannel: {
    type: String,
    default: "980789304248893450"
},

StreamChannel: {
    type: Array,
    default: []
},

AFKRoom: {
    type: Array,
    default: []
},

// LOG

RegisterLog: {
    type: String,
    default: ""
},

BanLog: {
    type: String,
    default: ""
},

JailLog: {
    type: String,
    default: ""
},

PenaltyPointLog: {
    type: String,
    default: ""
},

ChatMuteLog: {
    type: String,
    default: ""
},

VoiceMuteLog: {
    type: String,
    default: ""
},

UnbanLog: {
    type: String,
    default: ""
},

RightClickRoleManageLog: {
    type: String,
    default: ""
},

CommandBlockLog: {
    type: String,
    default: ""
},

BotRoleManageLog: {
    type: String,
    default: ""
},

JoinFamilyLog: {
    type: String,
    default: ""
},

LeaveFamilyLog: {
    type: String,
    default: ""
},

AuthyLeaveLog: {
    type: String,
    default: ""
},

RightClickRemovePunishmentLog: {
    type: String,
    default: ""
},

BannedTagLog: {
    type: String,
    default: ""
},

StreamPunitiveLog: {
    type: String,
    default: ""
},
})


module.exports = mongoose.model("kurulum", serverSettings);