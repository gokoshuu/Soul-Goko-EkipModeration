const mongoose = require("mongoose");

module.exports = mongoose.model("zade_banlar", new mongoose.Schema({
    user: { type: String }, 
    yetkili: {type: String},
    yasaklama: { type: Boolean, default: false},
    sebep: { type: String, default: ""},
    tarih: { type: String, default: ""}, 
}));