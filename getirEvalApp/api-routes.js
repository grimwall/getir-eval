//routes

let router = require('express').Router();

router.get('/', function(req, res){
    res.json({
        status: 'WORKGDSFD',
        message: 'here we goooo'
    });
});

var recordController = require('./recordController');

router.route('/records')
    .get(recordController.index)
    .post(recordController.search);

module.exports = router;