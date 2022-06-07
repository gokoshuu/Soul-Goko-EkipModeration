const mongoose = require("mongoose");

module.exports = mongoose.model("zade_unban", new mongoose.Schema({
    user: { type: String }, 
    mod: {type: String},
    sebep: {type: String}
}));