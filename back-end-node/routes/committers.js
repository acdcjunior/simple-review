const express = require('express');
const router = express.Router();

const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const CommitterRepository = require('../build/committers/CommitterRepository').CommitterRepository;

router.get('/', function(req, res) {
    CommitterRepository.findAllCommitters().then(committers => {
        addCors(req, res);
        res.send(committers);
    });
});

module.exports = router;
