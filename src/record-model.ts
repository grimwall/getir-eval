const mongoose = require("mongoose");

const recordSchema = mongoose.Schema({
    key: String,
    value: String,
    createdAt: Date,
    counts: [{
        type: Number
    }]
});

const Record = module.exports = mongoose.model("record", recordSchema);