const comentar = require('../code-review/comentar');
const Revisor = require('../code-review/Revisor');
const carregarCommitsAndCommitters = require('../code-review/carregarCommitsAndCommitters');
const addCors = require('./addCors');


const express = require('express');
const router = express.Router();

router.post('/marcar-revisado', function(req, res) {
    addCors(req, res);

    const sha = req.body.sha;
    const revisor = Revisor.removerDomainDoEmail(req.body.revisor);
    const feitoEmPar = req.body.feitoEmPar === "true";

    let comentarioRest;
    if (feitoEmPar) {
        comentarioRest = comentar(sha, `:white_check_mark: Commit marcado como **feito em par** por ${revisor}.`)
    } else {
        comentarioRest = comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado** por ${revisor}.`)
    }

    comentarioRest.then(() => {
        res.send({resultado:"sucesso!"});
    }).catch((err) => {
        res.status(500).send({ errorJSON: JSON.stringify(err) });
    })
});

router.post('/webhook', function(req, res) {
    carregarCommitsAndCommitters();
    res.send('ok-post');
});

module.exports = router;
