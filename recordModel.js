var mongoose = require('mongoose');

var recordSchema = mongoose.Schema({
    key: String,
    value: String,
    createdAt: Date,
    counts: [Number]
})

var Record = module.exports = mongoose.model('record', recordSchema);

module.exports.get = function (callback, limit) {
    Record.find(callback).limit(limit);
}