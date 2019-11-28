import { SearchReq } from "./search-req";
import { RecordEntity } from "./record-entity";
import moment = require("moment");
import { ResponseRecord } from "./response-record";
const Record = require("./record-model");

export class RecordRepo {

    async search(request: SearchReq): Promise<RecordEntity[]> {

        const startDate = moment(request.startDate);
        const endDate = moment(request.endDate);

        // todo figure out a better way for filtering on array sum
        // predicate to filter only records with sum of counts betwen required counts
        const whereFunc = `function () {  const arrSum = arr => arr.reduce((a, b) => a + b, 0);
                var sum = arrSum(this.counts);
                return (sum >= ` + request.minCount + ` && sum <= ` + request.maxCount + `);    }`;

        const query = Record
            .where("createdAt").gte(new Date(startDate.toDate())).lte(new Date(endDate.toDate()))
            .$where(whereFunc);

        return query.exec();
    }
}
