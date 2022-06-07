const mongoose = require("mongoose");

module.exports = mongoose.model("zade_extraMute", new mongoose.Schema({
    user: String, 
    array: Array
}));