import { RecordEntity } from "../record-entity";
import { SearchReq } from "../search-req";

export class RecordRepo {

    errorMsg: string = "errorrr";
    mockEntities: RecordEntity[] = [{
        key: "key",
        value: "value",
        createdAt: new Date('2012-10-19'),
        counts: [20, 30]
    }
    ]

    async search(request: SearchReq): Promise<RecordEntity[]> {
        let mockPromise = new Promise<RecordEntity[]>(
            (resolve, reject) => {
                if (request.minCount = 1) {
                    reject(this.errorMsg);
                } else {
                    resolve(this.mockEntities);
                }
            }
        );

        return mockPromise;
    }
}


