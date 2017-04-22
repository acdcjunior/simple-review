"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atribuirRevisores_1 = require("./atribuirRevisores");
const arrayShuffle_1 = require("../util/arrayShuffle");
const Commit_1 = require("../domain/Commit");
const Committer_1 = require("../domain/Committer");
const Sesol2Repository_1 = require("../domain/Sesol2Repository");
const Bluebird = require("bluebird");
Bluebird.longStackTraces();
arrayShuffle_1.ArrayShuffle.arrayShuffle = (arr) => arr.sort().reverse();
Sesol2Repository_1.sesol2Repository.insert = () => { };
const assert = require('assert');
const committers = [
    /* 0 */ { email: 'alexandrevr@example.com', percentualDeRevisoes: 20 },
    /* 1 */ { email: 'antonio.junior@example.com', percentualDeRevisoes: 50 },
    /* 2 */ { email: 'marcosps@example.com', percentualDeRevisoes: 20 },
    /* 3 */ { email: 'regiano@example.com', percentualDeRevisoes: 5 },
    /* 4 */ { email: 'fernandesm@example.com', percentualDeRevisoes: 5 },
    /* 5 */ { email: 'leliakn@example.com', percentualDeRevisoes: 0 },
    /* 6 */ { email: 'carlanm@example.com', percentualDeRevisoes: 0 },
    /* 7 */ { email: 'x04992831131@example.com', percentualDeRevisoes: 25 },
    /* 8 */ { email: 'x05068388213@example.com', percentualDeRevisoes: 25 },
    /* 9 */ { email: 'x05499033332@example.com', percentualDeRevisoes: 25 },
    /* 10 */ { email: 'x05929988846@example.com', percentualDeRevisoes: 25 },
];
Committer_1.Committer.findAll = () => Promise.resolve(committers);
const commits = [
    /*  0 */ { message: ' 0\n ', author_email: committers[1].email, historico: [], revisores: [committers[0].email] },
    /*  1 */ { message: ' 1\n ', author_email: committers[1].email, historico: [], revisores: [committers[1].email] },
    /*  2 */ { message: ' 2\n ', author_email: committers[1].email, historico: [], revisores: [] },
    /*  3 */ { message: ' 3\n ', author_email: committers[7].email, historico: [], revisores: [] },
    /*  4 */ { message: ' 4\n ', author_email: committers[1].email, historico: [], revisores: [] },
    /*  5 */ { message: ' 5\n ', author_email: committers[8].email, historico: [], revisores: [] },
    /*  6 */ { message: ' 6\n ', author_email: committers[1].email, historico: [], revisores: [] },
    /*  7 */ { message: ' 7\n ', author_email: committers[9].email, historico: [], revisores: [] },
    /*  8 */ { message: ' 8\n ', author_email: committers[1].email, historico: [], revisores: [] },
    /*  9 */ { message: ' 9\n ', author_email: committers[10].email, historico: [], revisores: [] },
    /* 10 */ { message: '10\n ', author_email: committers[1].email, historico: [], revisores: [] },
    /* 11 */ { message: '11\n ', author_email: committers[1].email, historico: [], revisores: [] },
    /* 12 */ { message: '12\n ', author_email: committers[1].email, historico: [], revisores: [] },
    /* 13 */ { message: '13\n @carlanm', author_email: committers[2].email, historico: [], revisores: [] },
    /* 14 */ { message: '14\n @leliakn', author_email: committers[7].email, historico: [], revisores: [] },
    /* 15 */ { message: '15\n @lelia', author_email: committers[1].email, historico: [], revisores: [] },
    /* 16 */ { message: '16\n @invalido', author_email: committers[2].email, historico: [], revisores: [] },
    /* 17 */ { message: '17\n @lelia', author_email: committers[5].email, historico: [], revisores: [] },
];
Commit_1.Commit.findAll = () => Promise.resolve(commits);
function debug(s) {
    console.log(s);
}
const expect = require("chai").expect;
describe("atribuirRevisores", function () {
    this.timeout(15000);
    it("atribuirRevisores", function () {
        return atribuirRevisores_1.atribuirRevisores().then(() => {
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
                debug(key + ': ' + counts[key]);
            });
            commits.forEach(commit => {
                debug(JSON.stringify(commit));
            });
            x({ message: " 0\n ", author_email: "antonio.junior@example.com", revisores: ["alexandrevr@example.com"], historico: [] });
            x({ message: " 1\n ", author_email: "antonio.junior@example.com", revisores: ["antonio.junior@example.com"], historico: [] });
            x({ message: " 2\n ", author_email: "antonio.junior@example.com", revisores: ["marcosps@example.com"], historico: ["Revisor marcosps@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[2]);
            x({ message: " 3\n ", author_email: "x04992831131@example.com", revisores: ["x05929988846@example.com", "fernandesm@example.com"], historico: ["Revisor x05929988846@example.com atribuído automaticamente pelo sistema.", "Revisor fernandesm@example.com atribuído automaticamente pelo sistema."] });
            assertCommitDeEstagiario(commits[3]);
            x({ message: " 4\n ", author_email: "antonio.junior@example.com", revisores: ["regiano@example.com"], historico: ["Revisor regiano@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[4]);
            x({ message: " 5\n ", author_email: "x05068388213@example.com", revisores: ["x04992831131@example.com", "antonio.junior@example.com"], historico: ["Revisor x04992831131@example.com atribuído automaticamente pelo sistema.", "Revisor antonio.junior@example.com atribuído automaticamente pelo sistema."] });
            assertCommitDeEstagiario(commits[5]);
            x({ message: " 6\n ", author_email: "antonio.junior@example.com", revisores: ["marcosps@example.com"], historico: ["Revisor marcosps@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[6]);
            x({ message: " 7\n ", author_email: "x05499033332@example.com", revisores: ["x05068388213@example.com", "antonio.junior@example.com"], historico: ["Revisor x05068388213@example.com atribuído automaticamente pelo sistema.", "Revisor antonio.junior@example.com atribuído automaticamente pelo sistema."] });
            assertCommitDeEstagiario(commits[7]);
            x({ message: " 8\n ", author_email: "antonio.junior@example.com", revisores: ["alexandrevr@example.com"], historico: ["Revisor alexandrevr@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[8]);
            x({ message: " 9\n ", author_email: "x05929988846@example.com", revisores: ["x05499033332@example.com", "antonio.junior@example.com"], historico: ["Revisor x05499033332@example.com atribuído automaticamente pelo sistema.", "Revisor antonio.junior@example.com atribuído automaticamente pelo sistema."] });
            assertCommitDeEstagiario(commits[9]);
            x({ message: "10\n ", author_email: "antonio.junior@example.com", revisores: ["alexandrevr@example.com"], historico: ["Revisor alexandrevr@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[10]);
            x({ message: "11\n ", author_email: "antonio.junior@example.com", revisores: ["marcosps@example.com"], historico: ["Revisor marcosps@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[11]);
            x({ message: "12\n ", author_email: "antonio.junior@example.com", revisores: ["alexandrevr@example.com"], historico: ["Revisor alexandrevr@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[12]);
            x({ message: "13\n revisor:carlanm", author_email: "marcosps@example.com", revisores: ["carlanm@example.com"], historico: ["Revisor carlanm@example.com atribuído por indicação via mensagem de commit."] });
            assertCommitRevisor(commits[13], "carlanm@example.com");
            x({ message: "14\n revisor:leliakn", author_email: "x04992831131@example.com", revisores: ["x05068388213@example.com", "leliakn@example.com"], historico: ["Revisor x05068388213@example.com atribuído automaticamente pelo sistema.", "Revisor leliakn@example.com atribuído por indicação via mensagem de commit."] });
            assertCommitDeEstagiario(commits[14]);
            assert.equal(commits[14].revisores[1], "leliakn@example.com");
            x({ message: "15\n revisor:lelia", author_email: "antonio.junior@example.com", revisores: ["leliakn@example.com"], historico: ["Revisor leliakn@example.com atribuído por indicação via mensagem de commit."] });
            assertCommitRevisor(commits[15], "leliakn@example.com");
            x({ message: "16\n revisor:invalid", author_email: "marcosps@example.com", revisores: ["antonio.junior@example.com"], historico: ["Revisão atribuída a revisor desconhecido: invalid@example.com. Ignorada.", "Revisor antonio.junior@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[16]);
            x({ message: "17\n revisor:lelia", author_email: "leliakn@example.com", revisores: ["marcosps@example.com"], historico: ["Revisão indicada não executada, pois o revisor indicado é o autor do commit.", "Revisor marcosps@example.com atribuído automaticamente pelo sistema."] });
            assertCommit(commits[17]);
            expect(commits[17].revisores[0]).to.not.equal("leliakn@example.com");
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
    return /[xX]\d{11}@example.com$/.test(authorEmail);
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
function x(x) { }
function assertJson(commits) {
    let expected = [
        { message: "x 0\n ", author_email: "antonio.junior@example.com", revisores: ["alexandrevr@example.com"], historico: [] },
        { message: " 1\n ", author_email: "antonio.junior@example.com", revisores: ["antonio.junior@example.com"], historico: [] },
        { message: " 2\n ", author_email: "antonio.junior@example.com", revisores: ["marcosps@example.com"], historico: ["Revisor @marcosps [Marcos Paulo Santos da Silva (MARCOSPS)] atribuído automaticamente."] },
        { message: " 3\n ", author_email: "x04992831131@example.com", revisores: ["x05068388213@example.com", "antonio.junior@example.com"], historico: ["Revisor @carvalhoj [Antonio C. de Carvalho Junior (CARVALHOJ)] atribuído automaticamente.", "Revisor @x05068388213 [REBECA ANDRADE BALDOMIR (X05068388213)] atribuído automaticamente."] },
        { message: " 4\n ", author_email: "antonio.junior@example.com", revisores: ["alexandrevr@example.com"], historico: ["Revisor @alexandrevr [Alexandre Silva Santos (ALEXANDREVR)] atribuído automaticamente."] },
        { message: " 5\n ", author_email: "x05068388213@example.com", revisores: ["x05499033332@example.com", "antonio.junior@example.com"], historico: ["Revisor @x05499033332 [AFONSO DIAS de OLIVEIRA CONCEICAO SILVA (X05499033332)] atribuído automaticamente.", "Revisor @carvalhoj [Antonio C. de Carvalho Junior (CARVALHOJ)] atribuído automaticamente."] },
        { message: " 6\n ", author_email: "antonio.junior@example.com", revisores: ["marcosps@example.com"], historico: ["Revisor @marcosps [Marcos Paulo Santos da Silva (MARCOSPS)] atribuído automaticamente."] },
        { message: " 7\n ", author_email: "x05499033332@example.com", revisores: ["x05929988846@example.com", "antonio.junior@example.com"], historico: ["Revisor @x05929988846 [BRUNO KYWAN VASCONCELOS GOIS (X05929988846)] atribuído automaticamente.", "Revisor @carvalhoj [Antonio C. de Carvalho Junior (CARVALHOJ)] atribuído automaticamente."] },
        { message: " 8\n ", author_email: "antonio.junior@example.com", revisores: ["alexandrevr@example.com"], historico: ["Revisor @alexandrevr [Alexandre Silva Santos (ALEXANDREVR)] atribuído automaticamente."] },
        { message: " 9\n ", author_email: "x05929988846@example.com", revisores: ["x04992831131@example.com", "antonio.junior@example.com"], historico: ["Revisor @x04992831131 [GABRIEL MESQUITA de ARAUJO (X04992831131)] atribuído automaticamente.", "Revisor @carvalhoj [Antonio C. de Carvalho Junior (CARVALHOJ)] atribuído automaticamente."] },
        { message: "10\n ", author_email: "antonio.junior@example.com", revisores: ["marcosps@example.com"], historico: ["Revisor @marcosps [Marcos Paulo Santos da Silva (MARCOSPS)] atribuído automaticamente."] },
        { message: "11\n ", author_email: "antonio.junior@example.com", revisores: ["alexandrevr@example.com"], historico: ["Revisor @alexandrevr [Alexandre Silva Santos (ALEXANDREVR)] atribuído automaticamente."] },
        { message: "12\n ", author_email: "antonio.junior@example.com", revisores: ["marcosps@example.com"], historico: ["Revisor @marcosps [Marcos Paulo Santos da Silva (MARCOSPS)] atribuído automaticamente."] },
        { message: "13\n @carlanm", author_email: "marcosps@example.com", revisores: ["carlanm@example.com"], historico: ["Revisor @CarlaNM [Carla Souza (CARLANM)] atribuído por indicação via mensagem de commit."] },
        { message: "14\n @leliakn", author_email: "x04992831131@example.com", revisores: ["x05068388213@example.com", "leliakn@example.com"], historico: ["Revisor @x05068388213 [REBECA ANDRADE BALDOMIR (X05068388213)] atribuído automaticamente.", "Revisor @LELIAKN [Lelia Silva Cotrim (LELIAKN)] atribuído por indicação via mensagem de commit."] },
        { message: "15\n @lelia", author_email: "antonio.junior@example.com", revisores: ["leliakn@example.com"], historico: ["Revisor @LELIAKN [Lelia Silva Cotrim (LELIAKN)] atribuído por indicação via mensagem de commit."] },
        { message: "16\n @invalido", author_email: "marcosps@example.com", revisores: ["regiano@example.com"], historico: ["Revisão atribuída a revisor desconhecido: invalid@example.com. Ignorada.", "Revisor @Regiano [Regiano da Silva Santos (REGIANO)] atribuído automaticamente."] },
        { message: "17\n @lelia", author_email: "leliakn@example.com", revisores: ["fernandesm@example.com"], historico: ["Revisão indicada não executada, pois o revisor indicado é o autor do commit.", "Revisor @fernandesm [Jose Mauricio Santos Medeiros (FERNANDESM)] atribuído automaticamente."] }
    ];
    expect(JSON.stringify(commits)).to.equal(JSON.stringify(expected));
}
