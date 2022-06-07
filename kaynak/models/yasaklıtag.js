const mongoose = require("mongoose");

module.exports = mongoose.model("zade_yasaklıtag", new mongoose.Schema({
  guild: String,
  taglar: Array
}));