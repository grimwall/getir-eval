import * as express from 'express';

const router = express.Router();

router.get("/", function(req, res) {
    res.json({
        status: "0",
        message: "here we goooo"
    });
});

let recordController = require("./recordController");

router.route("/records")
    .get(recordController.index)
    .post(recordController.search);

export = router;
