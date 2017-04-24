const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const CommitterRepository = require('../build/committers/CommitterRepository').CommitterRepository;
//noinspection JSUnresolvedVariable
const GitLabService = require('../build/gitlab/GitLabService').GitLabService;
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

    CommitterRepository.findCommittersByUsernameOrAlias(usernameRevisor).then((committer) => {
        switch (tipoRevisao) {
            case "par":
                return GitLabService.comentar(sha, `:white_check_mark: Commit marcado como **feito em par** por ${committer.mencao()}.`);
            case "com follow-up":
                return GitLabService.comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado com** ***follow-up*** por ${committer.mencao()}.`);
            default:
                return GitLabService.comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado sem** ***follow-up*** por ${committer.mencao()}.`);
        }
    }).then(() => {
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
