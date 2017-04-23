const CommitterRepository = require('../build/committers/CommitterRepository').CommitterRepository;
const addCors = require('./addCors');

const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    CommitterRepository.findAllCommitters().then(committers => {
        addCors(req, res);
        res.send(committers);
    });
});

module.exports = router;
