import * as express from 'express';

const router = express.Router();

let recordController = require("./recordController");

router.route("/records")
    .get(recordController.index)
    .post(recordController.search)
    .all(forbid());

router.route("*")
    .all(forbid());

export = router;

function forbid() {
    return (req, res) => {
        res.status(400).send({
            status: "1",
            message: "nope"
        }).end();
    };
}