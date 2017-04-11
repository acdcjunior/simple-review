const Committer = require('../code-review/domain/Committer');

const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    Committer.findAll().then(committers => {
        res.send(committers);
    });
});

module.exports = router;
