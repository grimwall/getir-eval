import * as moment from 'moment';
import { ResponseRecord } from './response-record'
import { RecordEntity } from './record-entity';
import { SearchReq } from './search-req';
import { RecordRepo } from './record-repo';

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

    const repo = new RecordRepo();

    repo.search(req.body).then(
        (records) => {
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
        },
        (err) => {
            console.error(err.stack);
            res.status(500)
                .json({
                    code: 1,
                    msg: "DB ERROR!: " + err
                });
        }
    );
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

    if (req.body.minCount > req.body.maxCount) {
        return "invalid counts, min must be smaller than max!";
    }
};