const mongoose = require("mongoose");

module.exports = mongoose.model("zade_isimler", new mongoose.Schema({
    user: String, 
    isimler: Array
}));