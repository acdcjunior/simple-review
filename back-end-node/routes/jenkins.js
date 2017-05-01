const express = require('express');
const router = express.Router();

const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const JenkinsCache = require('../build/integracaocontinua/JenkinsService').JenkinsCache;

router.get('/pipeline', function(req, res) {
    addCors(req, res);
    res.send(JenkinsCache.sagas2JobData);
});

module.exports = router;
