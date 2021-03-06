import * as express from 'express';

const router = express.Router();

const recordController = require("./record-controller");

router.route("/api/records")
    .post(recordController.search)
    .all(forbid());

router.route("*")
    .all(forbid());

export = router;

function forbid() {
    return (req, res) => {
        res.status(405).send({
            status: "1",
            message: "nope"
        }).end();
    };
}