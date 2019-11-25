const moment = require('moment');

Record = require('./recordModel');

//index actions
exports.index = function (req, res) {
    Record.get(function (err, records) {
        if (err) {
            res.json({
                status: "1",
                message: err,
            })
        }
        res.json({
            status: "0",
            message: "records retrieved",
            data: records
        });
    });
};

/*// todo view single record
exports.view = function(req, res){
    Record.findById()
};*/

//searches for records
exports.search = function (req, res) {
    //todo add filtering on count 
    
    var query = Record
        .where('createdAt')
        .gte(new Date(req.body.startDate))
        .lte(new Date(req.body.endDate));

    query.exec(function (err, records) {
        if (err)
            res.send(err);
        res.json({
            message: 'records are cooking..',
            data: records
        });
    });
};