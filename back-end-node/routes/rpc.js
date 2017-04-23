const addCors = require('./addCors');
const GitLabService = require('../build/gitlab/GitLabService');
const carregarCommitsAndCommitters = require("../build/codereview");

const express = require('express');
const router = express.Router();

router.post('/marcar-revisado', function(req, res) {
    addCors(req, res);

    const sha = req.body.sha;
    const revisor = req.body.revisor;
    const feitoEmPar = req.body.feitoEmPar === "true";

    let comentarioRest;
    if (feitoEmPar) {
        comentarioRest = GitLabService.comentar(sha, `:white_check_mark: Commit marcado como **feito em par** por ${revisor}.`)
    } else {
        comentarioRest = GitLabService.comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado** por ${revisor}.`)
    }

    comentarioRest.then(() => {
        res.send({resultado:"sucesso!"});
    }).catch((err) => {
        res.status(500).send({ errorJSON: JSON.stringify(err) });
    })
});

router.post('/webhook', function(req, res) {
    carregarCommitsAndCommitters.carregarCommitsAndCommitters();
    res.send('ok-post');
});

module.exports = router;
