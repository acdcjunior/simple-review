const Committer = require('../code-review/domain/Committer');
const addCors = require('./addCors');

const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    Committer.findAll().then(committers => {
        addCors(req, res);
        res.send(committers);
    });
});

module.exports = router;
