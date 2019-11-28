let mongoose = require("mongoose");

let recordSchema = mongoose.Schema({
    key: String,
    value: String,
    createdAt: Date,
    counts: [Number]
});

let Record = module.exports = mongoose.model("record", recordSchema);