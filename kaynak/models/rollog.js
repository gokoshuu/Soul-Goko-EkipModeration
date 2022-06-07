const mongoose = require("mongoose");

module.exports = mongoose.model("zade_rollog", new mongoose.Schema({
    user: String, 
    roller: Array
}));
