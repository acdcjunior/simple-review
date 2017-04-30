const express = require('express');
const router = express.Router();

const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const CommitRepository = require('../build/commit/CommitRepository').CommitRepository;

router.get('/', function(req, res) {
    CommitRepository.findAllCommits().then(commits => {
        addCors(req, res);
        res.render('splash', {
            title: 'Sesol-2 Code Review',
            qtdCommits: commits.length
        });
    });
});

module.exports = router;
