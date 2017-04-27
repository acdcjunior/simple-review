const rest = require('../build/infra/rest').rest;
const addCors = require('./addCors');

const express = require('express');
const router = express.Router();

router.get('/pipeline', function(req, res) {
    rest('GET', 'http://srv-ic-master:8089/view/Sesol-2/job/sagas2.pipeline/api/json?pretty=true').then(data => {
        addCors(req, res);
        res.send(data);
    });
});

module.exports = router;
