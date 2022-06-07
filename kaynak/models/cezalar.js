const mongoose = require("mongoose")

const zade_cezalar = new mongoose.Schema({
    user: String,
    ihlal: Number,
    yetkili: String,
    ceza: String,
    tarih: String,
    bitiş: String,
    sebep: String
})

module.exports = mongoose.model("zade_cezalar", zade_cezalar)