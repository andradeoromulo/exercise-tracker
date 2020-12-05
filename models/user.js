const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    count: Number,
    log: [{
        description: String,
        duration: Number,
        date: Date
    }]
});

module.exports = mongoose.model("User", User);