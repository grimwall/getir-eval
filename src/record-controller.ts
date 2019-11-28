import * as moment from 'moment';

var Record = require("./record-model");

// just returns all the records directly from mongo
exports.index = (req, res) => {
    Record.get((err, records: [ResponseRecord]) => {
        if (err) {
            console.error(err.stack);
            res.status(400).json({
                code: "1",
                msg: err,
            });
        }
        res.json({
            code: "0",
            msg: "records retrieved: " + records.length,
            records
        });
    }, 1000);
};

// searches for records
exports.search = (req, res) => {

    const errorMessage = hasValidInputs(req);

    if (errorMessage) {
        res.status(400)
            .json({
                code: 2,
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

    query.exec((err: any, records: [RecordEntity]) => {
        if (err) {
            console.error(err.stack);
            res.status(500)
                .json({
                    code: 1,
                    msg: "DB ERROR!: " + err
                });
        }

        res.json({
            code: 0,
            msg: "Retrieved record count: " + records.length,
            records: records.map((r: RecordEntity) => {
                // map to response
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
const arraySum = (array: [number]): number => array.reduce((a, b) => a + b, 0);

// validates dates and counts
const hasValidInputs = (req: { body: SearchReq; }): string => {
    // validate input
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);

    if (!req.body.startDate || !req.body.endDate || !startDate.isValid() || !endDate.isValid()) {
        console.log("invalid dates!");
        return "dates are required and must be in YYYY-MM-DD format!";
    }

    if (startDate.isAfter(endDate)) {
        console.log("invalid date order!");
        return "start date must not be after end date!";
    };

    if (isNaN(req.body.minCount) || isNaN(req.body.maxCount)) {
        return "invalid counts!";
    }
};