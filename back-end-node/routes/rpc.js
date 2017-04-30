const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const TipoRevisaoCommit = require('../build/commit/Commit').TipoRevisaoCommit;
//noinspection JSUnresolvedVariable
const carregarCommitsAndCommitters = require("../build/codereview").carregarCommitsAndCommitters;

const express = require('express');
const router = express.Router();

/** @namespace req.body.sha */
/** @namespace req.body.usernameRevisor */
/** @namespace req.body.tipoRevisao */
router.post('/comentar-revisado', function(req, res) {
    addCors(req, res);

    const sha = req.body.sha;
    const usernameRevisor = req.body.usernameRevisor;
    const tipoRevisao = req.body.tipoRevisao;

    TipoRevisaoCommit.comentar(usernameRevisor, sha, tipoRevisao).then(() => {
        res.send({resultado:"sucesso!"});
    }).catch((err, a) => {
        res.status(500).send({ erroPromise: err, a: a });
    })
});

router.post('/webhook', function(req, res) {
    carregarCommitsAndCommitters();
    res.send('ok-post');
});

module.exports = router;
