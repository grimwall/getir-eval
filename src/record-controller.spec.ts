import { SearchReq } from './search-req';
import { RecordRepo } from './record-repo';

jest.mock('./record-repo');

let recordController = require("../src/record-controller");

describe('validation errors', () => {

    test('invalid start date error', () => {

        let body: SearchReq = {
            startDate: 'xxx',
            endDate: '2012-10-20'
        };

        let req = { body: body };

        const res = mockResponse();

        recordController.search(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            code: 2,
            msg: "dates are required and must be in YYYY-MM-DD format!"
        });
    });

    test('invalid end date error', () => {

        let body: SearchReq = {
            startDate: '2012-10-20',
            endDate: '2012-10-20xxxx'
        };

        let req = { body: body };

        const res = mockResponse();

        recordController.search(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            code: 2,
            msg: "dates are required and must be in YYYY-MM-DD format!"
        });
    });

    test('invalid date order', () => {

        let body: SearchReq = {
            startDate: '2012-10-22',
            endDate: '2012-10-21',
            minCount: 10,
            maxCount: 20
        };

        let req = { body: body };

        const res = mockResponse();

        recordController.search(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            code: 2,
            msg: "start date must not be after end date!"
        });
    });

    test('invalid counts', () => {

        let body: SearchReq = {
            startDate: '2012-10-22',
            endDate: '2012-10-23',
            minCount: 30,
            maxCount: 20
        };

        let req = { body: body };

        const res = mockResponse();

        recordController.search(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            code: 2,
            msg: "invalid counts, min must be smaller than max!"
        });
    });

});
/* //todo figure out mocking here, async problem?
describe('db returns', () => {

    /*
        test('verify repo call error', () => {
    /*
            let body: SearchReq = {
                startDate: '2012-10-19',
                endDate: '2012-10-20',
                minCount: 10,
                maxCount: 20
            };
    
            let req = { body: body };
    
            const res = mockResponse();
    
            recordController.search(req, res);
    
            //expect(res.status).toHaveBeenCalledWith(400);
            /*expect(res.json).toHaveBeenCalledWith({
                code: 0,
                msg: "Retrieved record count: " + 1,
                records: [{
                    key: "key",
                    createdAt: new Date('2012-10-19'),
                    totalCount: 50
                }]
            });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        code: 1,
        msg: "DB ERROR!: " + "errorrr"
    });
});
});*/

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};