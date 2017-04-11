const Committer = require('../code-review/domain/Committer');

const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    Committer.findAll().then(committers => {
        res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.send(committers);
    });
});

module.exports = router;
