const moment = require('moment');

Record = require('./recordModel');

const arrSum = arr => arr.reduce((a, b) => a + b, 0);

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

    if (errorMessage){
        res.json({
            code: 1,
            msg: errorMessage
        });
        return res;
    }

    var startDate = moment(req.body.startDate);
    var endDate = moment(req.body.endDate);
    //todo figure out a better way for filtering on array sum
    var whereFunc = `function () {  const arrSum = arr => arr.reduce((a, b) => a + b, 0);
                var sum = arrSum(this.counts); 
                return (sum >= `+ req.body.minCount + ` && sum <= ` + req.body.maxCount + `);    }`;

    var query = Record
        .where('createdAt')
        .gte(new Date(startDate.toDate()))
        .lte(new Date(endDate.toDate()))
        .$where(whereFunc)
        //.select('createdAt key counts -_id')
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
                var rec = {};
                rec.key = r.key;
                rec.createdAt = r.createdAt;
                rec.totalCount = arrSum(r.counts);

                return rec;
            })
        });
    });
};

const hasValidInputs = function(req, err){
    //validate input
    var startDate = moment(req.body.startDate);
    var endDate = moment(req.body.endDate);    
    
    if (!startDate.isValid() || !endDate.isValid()) {
        console.log('invalid dates!');
        return 'invalid dates!';
    }

    if (isNaN(req.body.minCount )  || isNaN(req.body.maxCount) ){
        return 'invalid counts!';
    }
};