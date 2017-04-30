const express = require('express');
const router = express.Router();

const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const Rest = require('../build/infra/rest').Rest;

router.get('/pipeline', function(req, res) {
    Rest.get('http://srv-ic-master:8089/view/Sesol-2/job/sagas2.pipeline/api/json?pretty=true').then(data => {
        addCors(req, res);
        res.send(data);
    });
});

module.exports = router;
