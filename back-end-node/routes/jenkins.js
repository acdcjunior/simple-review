const express = require('express');
const router = express.Router();

const addCors = require('./addCors');
//noinspection JSUnresolvedVariable
const Rest = require('../build/infra/rest').Rest;

let jenkinsData = {};

function consultarJenkins() {
    Rest.get('http://srv-ic-master:8089/view/Sesol-2/job/sagas2.pipeline/api/json?pretty=true').then(data => {
        jenkinsData = data;
    }).catch(() => {
        console.log('Erro na consulta jenkins.')
    });
}

router.get('/pipeline', function(req, res) {
    addCors(req, res);
    res.send(jenkinsData);
});

setInterval(consultarJenkins, 60 * 1000);
consultarJenkins();

module.exports = router;
