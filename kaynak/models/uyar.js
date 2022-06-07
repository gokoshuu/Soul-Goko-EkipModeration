const mongoose = require("mongoose");

module.exports = mongoose.model("zade_uyarılar", new mongoose.Schema({
   user: String,
   uyarılar: Array,
}));