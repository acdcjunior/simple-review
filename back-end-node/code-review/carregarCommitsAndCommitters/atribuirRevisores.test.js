const Promise = require('bluebird');
Promise.longStackTraces();

const Committer = require('../domain/Committer');
const Commit = require('../domain/Commit');
const atribuirRevisores = require('./atribuirRevisores');
const ArrayShuffle = require('../util/arrayShuffle');

ArrayShuffle.arrayShuffle = (arr) => arr.sort().reverse();

const sesol2Repository = require('../domain/Sesol2Repository');
sesol2Repository.insert = () => { /* mock */ };

const assert = require('assert');

const committers = [
    /* 0 */  {email: 'alexandrevr@tcu.gov.br', percentualDeRevisoes: 20},
    /* 1 */  {email: 'antonio.junior@tcu.gov.br', percentualDeRevisoes: 50},
    /* 2 */  {email: 'marcosps@tcu.gov.br', percentualDeRevisoes: 20},
    /* 3 */  {email: 'regiano@tcu.gov.br', percentualDeRevisoes: 5},
    /* 4 */  {email: 'fernandesm@tcu.gov.br', percentualDeRevisoes: 5},
    /* 5 */  {email: 'leliakn@tcu.gov.br', percentualDeRevisoes: 0},
    /* 6 */  {email: 'carlanm@tcu.gov.br', percentualDeRevisoes: 0},
    /* 7 */  {email: 'x04912831131@tcu.gov.br', percentualDeRevisoes: 25},
    /* 8 */  {email: 'x05068385107@tcu.gov.br', percentualDeRevisoes: 25},
    /* 9 */  {email: 'x05491194182@tcu.gov.br', percentualDeRevisoes: 25},
    /* 10 */ {email: 'x05929991146@tcu.gov.br', percentualDeRevisoes: 25},
];
Committer.findAll = () => Promise.resolve(committers);

const commits = [
    /*  0 */ {message: ' 0\n ',          author_email: committers[1].email,  revisores: [committers[0].email]},
    /*  1 */ {message: ' 1\n ',          author_email: committers[1].email,  revisores: [committers[1].email]},
    /*  2 */ {message: ' 2\n ',          author_email: committers[1].email,  revisores: []},
    /*  3 */ {message: ' 3\n ',          author_email: committers[7].email,  revisores: []},
    /*  4 */ {message: ' 4\n ',          author_email: committers[1].email,  revisores: []},
    /*  5 */ {message: ' 5\n ',          author_email: committers[8].email,  revisores: []},
    /*  6 */ {message: ' 6\n ',          author_email: committers[1].email,  revisores: []},
    /*  7 */ {message: ' 7\n ',          author_email: committers[9].email,  revisores: []},
    /*  8 */ {message: ' 8\n ',          author_email: committers[1].email,  revisores: []},
    /*  9 */ {message: ' 9\n ',          author_email: committers[10].email, revisores: []},
    /* 10 */ {message: '10\n ',          author_email: committers[1].email,  revisores: []},
    /* 11 */ {message: '11\n ',          author_email: committers[1].email,  revisores: []},
    /* 12 */ {message: '12\n ',          author_email: committers[1].email,  revisores: []},
    /* 13 */ {message: '13\n @carlanm',  author_email: committers[2].email,  revisores: []},
    /* 14 */ {message: '14\n @leliakn',  author_email: committers[7].email,  revisores: []},
    /* 15 */ {message: '15\n @lelia',    author_email: committers[1].email,  revisores: []},
    /* 16 */ {message: '16\n @invalido', author_email: committers[2].email,  revisores: []},
    /* 17 */ {message: '17\n @lelia',    author_email: committers[5].email,  revisores: []},
];

commits.forEach(c => c.historico = []);

Commit.findAll = () => Promise.resolve(commits);

function debug(s) {
    console.log(s);
}

const expect = require("chai").expect;

describe("atribuirRevisores", function () {
    this.timeout(15000);

    it("atribuirRevisores", function () {

        return atribuirRevisores().then(() => {
            console.log('-- DENTRO DO TESTE - ATRIBUICAO CONCLUIDA --');

            const counts = {};
            commits.forEach(commit => {
                commit.revisores.forEach(revisor => {
                    counts[revisor] = (counts[revisor] || 0) + 1;
                });
                debug(`autor: ${commit.author_email} \trevisores: ${JSON.stringify(commit.revisores)} \thistorico: ${JSON.stringify(commit.historico)}`);
            });
            debug('---------------------------------');
            debug('COUNTS:');
            Object.keys(counts).sort().forEach(key => {
                debug(key + ': '+ counts[key]);
            });

            commits.forEach(commit => {
                debug(JSON.stringify(commit));
            });

            x({message:" 0\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["alexandrevr@tcu.gov.br"],                              historico:[]});
            x({message:" 1\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["antonio.junior@tcu.gov.br"],                           historico:[]});

            x({message:" 2\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["marcosps@tcu.gov.br"],                                 historico:["Revisor marcosps@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[2]);

            x({message:" 3\n ",                author_email:"x04912831131@tcu.gov.br",   revisores:["x05929991146@tcu.gov.br","fernandesm@tcu.gov.br"],     historico:["Revisor x05929991146@tcu.gov.br atribuído automaticamente pelo sistema.","Revisor fernandesm@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommitDeEstagiario(commits[3]);

            x({message:" 4\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["regiano@tcu.gov.br"],                                  historico:["Revisor regiano@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[4]);

            x({message:" 5\n ",                author_email:"x05068385107@tcu.gov.br",   revisores:["x04912831131@tcu.gov.br","antonio.junior@tcu.gov.br"], historico:["Revisor x04912831131@tcu.gov.br atribuído automaticamente pelo sistema.","Revisor antonio.junior@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommitDeEstagiario(commits[5]);

            x({message:" 6\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["marcosps@tcu.gov.br"],                                 historico:["Revisor marcosps@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[6]);

            x({message:" 7\n ",                author_email:"x05491194182@tcu.gov.br",   revisores:["x05068385107@tcu.gov.br","antonio.junior@tcu.gov.br"], historico:["Revisor x05068385107@tcu.gov.br atribuído automaticamente pelo sistema.","Revisor antonio.junior@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommitDeEstagiario(commits[7]);

            x({message:" 8\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["alexandrevr@tcu.gov.br"],                              historico:["Revisor alexandrevr@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[8]);

            x({message:" 9\n ",                author_email:"x05929991146@tcu.gov.br",   revisores:["x05491194182@tcu.gov.br","antonio.junior@tcu.gov.br"], historico:["Revisor x05491194182@tcu.gov.br atribuído automaticamente pelo sistema.","Revisor antonio.junior@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommitDeEstagiario(commits[9]);

            x({message:"10\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["alexandrevr@tcu.gov.br"],                              historico:["Revisor alexandrevr@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[10]);

            x({message:"11\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["marcosps@tcu.gov.br"],                                 historico:["Revisor marcosps@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[11]);

            x({message:"12\n ",                author_email:"antonio.junior@tcu.gov.br", revisores:["alexandrevr@tcu.gov.br"],                              historico:["Revisor alexandrevr@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[12]);

            x({message:"13\n revisor:carlanm", author_email:"marcosps@tcu.gov.br",       revisores:["carlanm@tcu.gov.br"],                                  historico:["Revisor carlanm@tcu.gov.br atribuído por indicação via mensagem de commit."]});
            assertCommitRevisor(commits[13], "carlanm@tcu.gov.br");

            x({message:"14\n revisor:leliakn", author_email:"x04912831131@tcu.gov.br",   revisores:["x05068385107@tcu.gov.br","leliakn@tcu.gov.br"],        historico:["Revisor x05068385107@tcu.gov.br atribuído automaticamente pelo sistema.","Revisor leliakn@tcu.gov.br atribuído por indicação via mensagem de commit."]});
            assertCommitDeEstagiario(commits[14]);
            assert.equal(commits[14].revisores[1], "leliakn@tcu.gov.br");

            x({message:"15\n revisor:lelia",   author_email:"antonio.junior@tcu.gov.br", revisores:["leliakn@tcu.gov.br"],                                  historico:["Revisor leliakn@tcu.gov.br atribuído por indicação via mensagem de commit."]});
            assertCommitRevisor(commits[15], "leliakn@tcu.gov.br");

            x({message:"16\n revisor:invalid", author_email:"marcosps@tcu.gov.br",       revisores:["antonio.junior@tcu.gov.br"],                           historico:["Revisão atribuída a revisor desconhecido: invalid@tcu.gov.br. Ignorada.","Revisor antonio.junior@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[16]);

            x({message:"17\n revisor:lelia", author_email:"leliakn@tcu.gov.br", revisores:["marcosps@tcu.gov.br"],                                 historico:["Revisão indicada não executada, pois o revisor indicado é o autor do commit.","Revisor marcosps@tcu.gov.br atribuído automaticamente pelo sistema."]});
            assertCommit(commits[17]);
            expect(commits[17].revisores[0]).to.not.equal("leliakn@tcu.gov.br");

            assertJson(commits);

            return Promise.resolve();
        });
    });

});

function assertCommit(commit) {
    expect(commit.historico.length).to.be.above(0);
    expect(commit.revisores.length).to.be.above(0);
    expect(commit.historico.length).to.be.at.least(commit.revisores.length);
    expect(commit.revisores.indexOf(commit.author_email)).to.equal(-1);
}

function isEstagiario(authorEmail) {
    return /[xX]\d{11}@tcu.gov.br$/.test(authorEmail);
}

function assertCommitDeEstagiario(commit) {
    assertCommit(commit);
    assert.equal(commit.historico.length, 2);
    assert.notEqual(commit.author_email, commit.revisores[0]);
    assert.notEqual(commit.author_email, commit.revisores[1]);

    assert(isEstagiario(commit.author_email));
    assert(isEstagiario(commit.revisores[0]));
    assert(!isEstagiario(commit.revisores[1]));
}

function assertCommitRevisor(commit, revisor) {
    assertCommit(commit);
    assert(commit.historico.length > 0);
    assert(commit.historico.length >= commit.revisores.length);

    assert.equal(commit.revisores.length, 1, `Commit ${commit.message} - esperado um revisor, obtidos: ${commit.revisores}\n\n${JSON.stringify(commit)}`);
    assert.equal(commit.revisores[0], revisor);


    assert(commit.revisores.indexOf(commit.author_email) === -1);
}

function x(x) {}


function assertJson(commits) {
    let expected = [
        {message: "x 0\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["alexandrevr@tcu.gov.br"],                              historico: []    },
        {message: " 1\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["antonio.junior@tcu.gov.br"],                            historico: []    },
        {message: " 2\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["marcosps@tcu.gov.br"],                                  historico: ["Revisor @marcosps [Marcos Paulo Pereira da Silva (MARCOSPS)] atribuído automaticamente."]    },
        {message: " 3\n ",          author_email: "x04912831131@tcu.gov.br",   revisores: ["x05068385107@tcu.gov.br", "antonio.junior@tcu.gov.br"], historico: ["Revisor @carvalhoj [Antonio C. de Carvalho Junior (CARVALHOJ)] atribuído automaticamente.", "Revisor @x05068385107 [REBECA ANDRADE BALDOMIR (X05068385107)] atribuído automaticamente."]    },
        {message: " 4\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["alexandrevr@tcu.gov.br"],                               historico: ["Revisor @alexandrevr [Alexandre Vaz Roriz (ALEXANDREVR)] atribuído automaticamente."]    },
        {message: " 5\n ",          author_email: "x05068385107@tcu.gov.br",   revisores: ["x05491194182@tcu.gov.br", "antonio.junior@tcu.gov.br"], historico: ["Revisor @x05491194182 [AFONSO DIAS de OLIVEIRA CONCEICAO SILVA (X05491194182)] atribuído automaticamente.", "Revisor @carvalhoj [Antonio C. de Carvalho Junior (CARVALHOJ)] atribuído automaticamente."]    },
        {message: " 6\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["marcosps@tcu.gov.br"],                                  historico: ["Revisor @marcosps [Marcos Paulo Pereira da Silva (MARCOSPS)] atribuído automaticamente."]    },
        {message: " 7\n ",          author_email: "x05491194182@tcu.gov.br",   revisores: ["x05929991146@tcu.gov.br", "antonio.junior@tcu.gov.br"], historico: ["Revisor @x05929991146 [BRUNO KYWAN VASCONCELOS GOIS (X05929991146)] atribuído automaticamente.", "Revisor @carvalhoj [Antonio C. de Carvalho Junior (CARVALHOJ)] atribuído automaticamente."]    },
        {message: " 8\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["alexandrevr@tcu.gov.br"],                               historico: ["Revisor @alexandrevr [Alexandre Vaz Roriz (ALEXANDREVR)] atribuído automaticamente."]    },
        {message: " 9\n ",          author_email: "x05929991146@tcu.gov.br",   revisores: ["x04912831131@tcu.gov.br", "antonio.junior@tcu.gov.br"], historico: ["Revisor @x04912831131 [GABRIEL MESQUITA de ARAUJO (X04912831131)] atribuído automaticamente.", "Revisor @carvalhoj [Antonio C. de Carvalho Junior (CARVALHOJ)] atribuído automaticamente."]    },
        {message: "10\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["marcosps@tcu.gov.br"],                                  historico: ["Revisor @marcosps [Marcos Paulo Pereira da Silva (MARCOSPS)] atribuído automaticamente."]    },
        {message: "11\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["alexandrevr@tcu.gov.br"],                               historico: ["Revisor @alexandrevr [Alexandre Vaz Roriz (ALEXANDREVR)] atribuído automaticamente."]    },
        {message: "12\n ",          author_email: "antonio.junior@tcu.gov.br", revisores: ["marcosps@tcu.gov.br"],                                  historico: ["Revisor @marcosps [Marcos Paulo Pereira da Silva (MARCOSPS)] atribuído automaticamente."]    },
        {message: "13\n @carlanm",  author_email: "marcosps@tcu.gov.br",       revisores: ["carlanm@tcu.gov.br"],                                   historico: ["Revisor @CarlaNM [Carla Nassif Cortez Marcomini (CARLANM)] atribuído por indicação via mensagem de commit."]    },
        {message: "14\n @leliakn",  author_email: "x04912831131@tcu.gov.br",   revisores: ["x05068385107@tcu.gov.br", "leliakn@tcu.gov.br"],        historico: ["Revisor @x05068385107 [REBECA ANDRADE BALDOMIR (X05068385107)] atribuído automaticamente.", "Revisor @LELIAKN [Lelia Karina Nunes Cotrim (LELIAKN)] atribuído por indicação via mensagem de commit."]    },
        {message: "15\n @lelia",    author_email: "antonio.junior@tcu.gov.br", revisores: ["leliakn@tcu.gov.br"],                                   historico: ["Revisor @LELIAKN [Lelia Karina Nunes Cotrim (LELIAKN)] atribuído por indicação via mensagem de commit."]    },
        {message: "16\n @invalido", author_email: "marcosps@tcu.gov.br",       revisores: ["regiano@tcu.gov.br"],                                   historico: ["Revisão atribuída a revisor desconhecido: invalid@tcu.gov.br. Ignorada.", "Revisor @Regiano [Regiano da Silva Alves (REGIANO)] atribuído automaticamente."]    },
        {message: "17\n @lelia",    author_email: "leliakn@tcu.gov.br",        revisores: ["fernandesm@tcu.gov.br"],                                historico: ["Revisão indicada não executada, pois o revisor indicado é o autor do commit.", "Revisor @fernandesm [Jose Mauricio Fernandes Medeiros (FERNANDESM)] atribuído automaticamente."]}
    ];
    expect(JSON.stringify(commits)).to.equal(JSON.stringify(expected));
}