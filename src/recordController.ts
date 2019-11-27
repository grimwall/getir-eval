import * as moment from 'moment';

var Record = require("./recordModel");

// just returns all the records
exports.index = function (req, res) {
    Record.get(function (err, records: ResponseRecord) {
        if (err) {
            res.json({
                code: "1",
                msg: err,
            });
        }
        res.json({
            code: "0",
            msg: "records retrieved",
            records
        });
    });
};

// searches for records
exports.search = function (req, res) {

    const errorMessage = hasValidInputs(req);

    if (errorMessage) {
        res.json({
            code: 1,
            msg: errorMessage
        });
        return res;
    }

    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);

    // todo figure out a better way for filtering on array sum
    // predicate to filter only records with sum of counts betwen required counts
    const whereFunc = `function () {  const arrSum = arr => arr.reduce((a, b) => a + b, 0);
                var sum = arrSum(this.counts);
                return (sum >= ` + req.body.minCount + ` && sum <= ` + req.body.maxCount + `);    }`;

    const query = Record
        .where("createdAt")
        .gte(new Date(startDate.toDate()))
        .lte(new Date(endDate.toDate()))
        .$where(whereFunc)
        ;

    query.exec(function (err: any, records: [RecordEntity]) {
        if (err) {
            res.json({
                code: 1,
                msg: "DB ERROR!: " + err
            });
        }
        res.json({
            code: 0,
            msg: "Retrieved record count: " + records.length,
            records: records.map((r: RecordEntity) => {
                // return only the required fields
                const rec: ResponseRecord = {
                    key: r.key,
                    createdAt: r.createdAt,
                    totalCount: arraySum(r.counts)
                };

                return rec;
            })
        });
    });
};

// sums a number array
const arraySum = (array: [number]) => array.reduce((a, b) => a + b, 0);

// validates dates and counts
const hasValidInputs = function (req: { body: SearchReq; }) {
    // validate input
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);

    if (!startDate.isValid() || !endDate.isValid()) {
        console.log("invalid dates!");
        return "invalid dates!";
    }

    if (isNaN(req.body.minCount) || isNaN(req.body.maxCount)) {
        return "invalid counts!";
    }
};
