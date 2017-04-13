const comentar = require('../code-review/comentar');
const Revisor = require('../code-review/Revisor');

const express = require('express');
const router = express.Router();

router.post('/marcar-revisado', function(req, res, next) {
    const sha = req.body.sha;
    const revisor = Revisor.removerDomainDoEmail(req.body.revisor);
    const feitoEmPar = req.body.feitoEmPar;

    if (feitoEmPar) {
        comentar(sha, `:white_check_mark: Commit marcado como **feito em par** por ${revisor}.`)
    } else {
        comentar(sha, `:ballot_box_with_check: Commit marcado como **revisado** por ${revisor}.`)
    }

    res.send('OK!');
});

module.exports = router;
