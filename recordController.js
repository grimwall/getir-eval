const moment = require('moment');

Record = require('./recordModel');



//index actions
exports.index = function (req, res) {
    Record.get(function (err, records) {
        if (err) {
            res.json({
                code: "1",
                msg: err,
            })
        }
        res.json({
            code: "0",
            msg: "records retrieved",
            records: records
        });
    });
};

//searches for records
exports.search = function (req, res) {

    var errorMessage = hasValidInputs(req);

    if (errorMessage) {
        res.json({
            code: 1,
            msg: errorMessage
        });
        return res;
    }

    var startDate = moment(req.body.startDate);
    var endDate = moment(req.body.endDate);

    //todo figure out a better way for filtering on array sum
    //predicate to filter only records with sum of counts betwen required counts
    var whereFunc = `function () {  const arrSum = arr => arr.reduce((a, b) => a + b, 0);
                var sum = arrSum(this.counts); 
                return (sum >= `+ req.body.minCount + ` && sum <= ` + req.body.maxCount + `);    }`;


    var query = Record
        .where('createdAt')
        .gte(new Date(startDate.toDate()))
        .lte(new Date(endDate.toDate()))
        .$where(whereFunc)
        ;

    query.exec(function (err, records) {
        if (err)
            res.json({
                code: 1,
                msg: 'DB ERROR!: ' + err
            })
        res.json({
            code: 0,
            msg: 'Retrieved record count: ' + records.length,
            records: records.map(r => {
                //return only the required fields
                var rec = {};
                rec.key = r.key;
                rec.createdAt = r.createdAt;
                rec.totalCount = arraySum(r.counts);

                return rec;
            })
        });
    });
};

//sums a number array
const arraySum = arr => arr.reduce((a, b) => a + b, 0);

//validates dates and counts
const hasValidInputs = function (req) {
    //validate input
    var startDate = moment(req.body.startDate);
    var endDate = moment(req.body.endDate);

    if (!startDate.isValid() || !endDate.isValid()) {
        console.log('invalid dates!');
        return 'invalid dates!';
    }

    if (isNaN(req.body.minCount) || isNaN(req.body.maxCount)) {
        return 'invalid counts!';
    }
};