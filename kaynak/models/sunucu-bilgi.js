const mongoose = require("mongoose")

const zade_sunucu = new mongoose.Schema({
   guild: String,
   ihlal: Number
})

module.exports = mongoose.model("zade__sunucu", zade_sunucu)