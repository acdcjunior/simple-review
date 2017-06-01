import * as sinon from 'sinon';
import {expect} from "chai";
import {RevisoresService} from "./RevisoresService";
import {ArrayUtils} from "../geral/ArrayUtils";
import {Commit} from "./Commit";
import {Committer} from "../committers/Committer";
import {sesol2Repository} from "../geral/Sesol2Repository";

import * as Bluebird from 'bluebird';
import {GitLabService} from "../gitlab/GitLabService";
import {Email} from "../geral/Email";
import {CommitterRepository} from "../committers/CommitterRepository";
import {CommitRepository} from "./CommitRepository";
Bluebird.longStackTraces();

GitLabService.desabilitarComentariosNoGitLab = true;

const assert = require('assert');

function gu(email, name, username) {
    return {
        username: username,
        email: email,
        name: name,
        avatar_url: undefined,
        id: undefined,
        state: undefined,
        web_url: undefined,
        invalido: undefined
    };
}

const committers = [
    /* 0 */  new Committer(gu('alexandrevr@example.com',    "Alexandre Silva Santos (ALEXANDREVR)",            'alexandrevr'),  null, [],          25, "m"),
    /* 1 */  new Committer(gu('antonio.junior@example.com', "Antonio C. de Carvalho Junior (CARVALHOJ)",    'carvalhoj'),    null, ["antonio"], 40, "m"),
    /* 2 */  new Committer(gu('marcosps@example.com',       "Marcos Paulo Santos da Silva (MARCOSPS)",     'marcosps'),     null, ["marcos"],  25, "m"),
    /* 3 */  new Committer(gu('regiano@example.com',        "Regiano da Silva Santos (REGIANO)",             'regiano'),      null, [],          10, "m"),
    /* 4 */  new Committer(gu('fernandesm@example.com',     "Jose Mauricio Santos (FERNANDESM)",         'fernandesm'),   null, [],          0,  "m"),
    /* 5 */  new Committer(gu('leliakn@example.com',        "Lelia Silva (LELIAKN)",                 'LELIAKN'),      null, ["lelia"],   0,  "f"),
    /* 6 */  new Committer(gu('carlanm@example.com',        "Carla Souza (CARLANM)",      'CarlaNM'),      null, [],          0,  "f"),
    /* 7 */  new Committer(gu('x04992831131@example.com',   "Gabriel Mesquita de Araujo (X04992831131)",    'x04992831131'), null, [],          25, "m"),
    /* 8 */  new Committer(gu('x05068388213@example.com',   "Rebeca Andrade Silva (X05068388213)",       'x05068388213'), null, [],          25, "f"),
    /* 9 */  new Committer(gu('x05499033332@example.com',   "Afonso Santos de Souza Silva (X05499033332)", 'x05499033332'), null, ["afonso"],  25, "m"),
    /* 10 */ new Committer(gu('x05929988846@example.com',   "Bruno Silva Santos Souza (X05929988846)",  'x05929988846'), null, [],          25, undefined),
    /* 11 */ new Committer(gu('sonarqube-bot@example.com',  "SonarQube-GitLab",                             'sonarqube'),    null, [],          0,  "m") // bot comentador!!!
];

const commit0 = new Commit('sha 0', 't 0', ' 0\n ',                  committers[1].email,  '');
commit0.revisores.push(committers[0].email);
const commit1 = new Commit('sha 1', 't 1', ' 1\n ',                  committers[1].email,  '');
commit1.revisores.push(committers[6].email);

const commits = [
    /*  0 */ commit0,
    /*  1 */ commit1,
    /*  2 */ new Commit('sha 2', 't 2', ' 2\n ',                                  committers[1].email,  ''),
    /*  3 */ new Commit('sha 3', 't 3', ' 3\n ',                                  committers[7].email,  ''),
    /*  4 */ new Commit('sha 4', 't 4', ' 4\n ',                                  committers[1].email,  ''),
    /*  5 */ new Commit('sha 5', 't 5', ' 5\n ',                                  committers[8].email,  ''),
    /*  6 */ new Commit('sha 6', 't 6', ' 6\n ',                                  committers[1].email,  ''),
    /*  7 */ new Commit('sha 7', 't 7', ' 7\n ',                                  committers[9].email,  ''),
    /*  8 */ new Commit('sha 8', 't 8', ' 8\n ',                                  committers[1].email,  ''),
    /*  9 */ new Commit('sha 9', 't 9', ' 9\n ',                                  committers[10].email, ''),
    /* 10 */ new Commit('sha10', 't10', '10\n ',                                  committers[1].email,  ''),
    /* 11 */ new Commit('sha11', 't11', '11\n ',                                  committers[1].email,  ''),
    /* 12 */ new Commit('sha12', 't12', '12\n ',                                  committers[1].email,  ''),
    /* 13 */ new Commit('sha13', 't13', '13\n @carlanm',                          committers[2].email,  ''),
    /* 14 */ new Commit('sha14', 't14', '14\n @leliakn',                          committers[7].email,  ''),
    /* 15 */ new Commit('sha15', 't15', '15\n@leLIA',                            committers[1].email,  ''),
    /* 16 */ new Commit('sha16', 't16', '16\n @invalido',                         committers[2].email,  ''),
    /* 17 */ new Commit('sha17', 't17', '17\n @lelia @antonio . @marcos @afonso', committers[5].email,  ''),
    /* 18 */ new Commit('sha18', 't18', `Merge branch 'x' into x`,                committers[1].email,  ''),
];

describe("RevisoresService suite", function () {
    this.timeout(15000);

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        sandbox.stub(CommitterRepository, 'findCommitterByUsernameOrAlias').callsFake((usernameOrAlias) => {
            const committer = committers.find(committer => committer.aliases.indexOf(usernameOrAlias) !== -1);
            if (!committer) return Promise.resolve(Committer.committerInvalido(usernameOrAlias));
            return Promise.resolve(committer);
        });
        sandbox.stub(CommitterRepository, 'findAllCommitters').returns(Promise.resolve(committers));
        sandbox.stub(CommitRepository, 'findAllCommits').returns(Promise.resolve(commits));
        sandbox.stub(sesol2Repository, 'insert').returns(Promise.resolve("mock"));
        sandbox.stub(ArrayUtils, 'arrayShuffle').callsFake((arr) => arr.sort().reverse());
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("atribuirRevisores()", function () {
        return RevisoresService.atribuirRevisores().then(() => {
            assertCommitComRevisoresEHistorico(commits[2]);
            assertCommitDeEstagiario(commits[3]);
            assertCommitComRevisoresEHistorico(commits[4]);
            assertCommitDeEstagiario(commits[5]);
            assertCommitComRevisoresEHistorico(commits[6]);
            assertCommitDeEstagiario(commits[7]);
            assertCommitComRevisoresEHistorico(commits[8]);
            assertCommitDeEstagiario(commits[9]);
            assertCommitComRevisoresEHistorico(commits[10]);
            assertCommitComRevisoresEHistorico(commits[11]);
            assertCommitComRevisoresEHistorico(commits[12]);
            assertCommitRevisor(commits[13], "carlanm@example.com");

            assertCommitDeEstagiario(commits[14]);
            expect(commits[14].revisores[0]).to.equal("leliakn@example.com");

            expect(commits[15].revisores[0]).to.equal("leliakn@example.com");
            assertCommitRevisor(commits[15], "leliakn@example.com");

            assertCommitComRevisoresEHistorico(commits[16]);

            assertCommitComRevisoresEHistorico(commits[17]);
            expect(commits[17].revisores[0]).to.not.equal("leliakn@example.com");

            assertJson(commits);
        });
    });

});

function assertCommitComRevisoresEHistorico(commit) {
    expect(commit.historico.length).to.be.above(0);
    expect(commit.revisores.length).to.be.above(0);
    expect(commit.historico.length).to.be.at.least(commit.revisores.length);
    expect(commit.revisores.indexOf(commit.author_email)).to.equal(-1);
}

function isEstagiario(authorEmail) {
    return new Email(authorEmail).isEmailDeEstagiario();
}

function assertCommitDeEstagiario(commit) {
    assertCommitComRevisoresEHistorico(commit);
    assert.equal(commit.historico.length, 2);
    assert.notEqual(commit.author_email, commit.revisores[0]);
    assert.notEqual(commit.author_email, commit.revisores[1]);

    assert(isEstagiario(commit.author_email));
    expect(commit.revisores.filter(isEstagiario)).to.have.lengthOf(1);
    expect(commit.revisores.filter(x => !isEstagiario(x))).to.have.lengthOf(1);
}

function assertCommitRevisor(commit, revisor) {
    assertCommitComRevisoresEHistorico(commit);
    assert(commit.historico.length > 0);
    assert(commit.historico.length >= commit.revisores.length);

    assert.equal(commit.revisores.length, 1, `Commit ${commit.message} - esperado um revisor, obtidos: ${commit.revisores}\n\n${JSON.stringify(commit)}`);
    assert.equal(commit.revisores[0], revisor);

    assert(commit.revisores.indexOf(commit.author_email) === -1);
}

function assertJson(commits) {
    commits.forEach(c => {
       delete c._id;
       delete c.type;
       delete c.sha;
       delete c.title;
       delete c.created_at;
    });
    const removerFinal = (data) => data.replace(/:\d\d\.\d\d\dZ$/, ':SS.MMMZ');
    commits[18].revisoes[0].data = removerFinal(commits[18].revisoes[0].data);
    let expected = [
        {message:" 0\n ",          author_email:"antonio.junior@example.com", revisores:["alexandrevr@example.com"],                              revisoes:[], historico:[]},
        {message:" 1\n ",          author_email:"antonio.junior@example.com", revisores:["carlanm@example.com"],                                  revisoes:[], historico:[]},
        {message:" 2\n ",          author_email:"antonio.junior@example.com", revisores:["marcosps@example.com"],                                 revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Marcos Paulo Santos da Silva (MARCOSPS)` atribuído automaticamente."]},
        {message:" 3\n ",          author_email:"x04992831131@example.com",   revisores:["x05068388213@example.com","antonio.junior@example.com"], revisoes:[], historico:[":heavy_plus_sign: :gear: Revisora `Rebeca Andrade Silva (X05068388213)` atribuída automaticamente.",":heavy_plus_sign: :gear: Revisor `Antonio C. de Carvalho Junior (CARVALHOJ)` atribuído automaticamente."]},
        {message:" 4\n ",          author_email:"antonio.junior@example.com", revisores:["regiano@example.com"],                                  revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Regiano da Silva Santos (REGIANO)` atribuído automaticamente."]},
        {message:" 5\n ",          author_email:"x05068388213@example.com",   revisores:["x04992831131@example.com","antonio.junior@example.com"], revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Gabriel Mesquita de Araujo (X04992831131)` atribuído automaticamente.",":heavy_plus_sign: :gear: Revisor `Antonio C. de Carvalho Junior (CARVALHOJ)` atribuído automaticamente."]},
        {message:" 6\n ",          author_email:"antonio.junior@example.com", revisores:["alexandrevr@example.com"],                              revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Alexandre Silva Santos (ALEXANDREVR)` atribuído automaticamente."]},
        {message:" 7\n ",          author_email:"x05499033332@example.com",   revisores:["x05929988846@example.com","marcosps@example.com"],       revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor(a) `Bruno Silva Santos Souza (X05929988846)` atribuído(a) automaticamente.",":heavy_plus_sign: :gear: Revisor `Marcos Paulo Santos da Silva (MARCOSPS)` atribuído automaticamente."]},
        {message:" 8\n ",          author_email:"antonio.junior@example.com", revisores:["alexandrevr@example.com"],                              revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Alexandre Silva Santos (ALEXANDREVR)` atribuído automaticamente."]},
        {message:" 9\n ",          author_email:"x05929988846@example.com",   revisores:["x05499033332@example.com","antonio.junior@example.com"], revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Afonso Santos de Souza Silva (X05499033332)` atribuído automaticamente.",":heavy_plus_sign: :gear: Revisor `Antonio C. de Carvalho Junior (CARVALHOJ)` atribuído automaticamente."]},
        {message:"10\n ",          author_email:"antonio.junior@example.com", revisores:["marcosps@example.com"],                                 revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Marcos Paulo Santos da Silva (MARCOSPS)` atribuído automaticamente."]},
        {message:"11\n ",          author_email:"antonio.junior@example.com", revisores:["regiano@example.com"],                                  revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Regiano da Silva Santos (REGIANO)` atribuído automaticamente."]},
        {message:"12\n ",          author_email:"antonio.junior@example.com", revisores:["alexandrevr@example.com"],                              revisoes:[], historico:[":heavy_plus_sign: :gear: Revisor `Alexandre Silva Santos (ALEXANDREVR)` atribuído automaticamente."]},
        {message:"13\n @carlanm",  author_email:"marcosps@example.com",       revisores:["carlanm@example.com"],                                  revisoes:[], historico:[":heavy_plus_sign: :point_right: Revisora `Carla Souza (CARLANM)` atribuída via menção em mensagem de commit."]},
        {message:"14\n @leliakn",  author_email:"x04992831131@example.com",   revisores:["leliakn@example.com","x05068388213@example.com"],        revisoes:[], historico:[":heavy_plus_sign: :point_right: Revisora `Lelia Silva (LELIAKN)` atribuída via menção em mensagem de commit.",":heavy_plus_sign: :gear: Revisora `Rebeca Andrade Silva (X05068388213)` atribuída automaticamente."]},
        {message:"15\n@leLIA",     author_email:"antonio.junior@example.com", revisores:["leliakn@example.com"],                                  revisoes:[], historico:[":heavy_plus_sign: :point_right: Revisora `Lelia Silva (LELIAKN)` atribuída via menção em mensagem de commit."]},
        {message:"16\n @invalido", author_email:"marcosps@example.com",       revisores:["antonio.junior@example.com"],                           revisoes:[], historico:["Revisor(a) @invalido mencionado(a), mas não reconhecido(a) na base de usuários. Menção ignorada.",":heavy_plus_sign: :gear: Revisor `Antonio C. de Carvalho Junior (CARVALHOJ)` atribuído automaticamente."]},
        {
            message:"17\n @lelia @antonio . @marcos @afonso",
            author_email:"leliakn@example.com",
            revisores:["antonio.junior@example.com", "marcosps@example.com", "x05499033332@example.com"],
            revisoes:[],
            historico:[
                "Revisora `Lelia Silva (LELIAKN)` mencionada é autora do commit. Menção ignorada.",
                ":heavy_plus_sign: :point_right: Revisor `Antonio C. de Carvalho Junior (CARVALHOJ)` atribuído via menção em mensagem de commit.",
                ":heavy_plus_sign: :point_right: Revisor `Marcos Paulo Santos da Silva (MARCOSPS)` atribuído via menção em mensagem de commit.",
                ":heavy_plus_sign: :point_right: Revisor `Afonso Santos de Souza Silva (X05499033332)` atribuído via menção em mensagem de commit."
            ]
        },
        {
            message:"Merge branch 'x' into x",
            author_email:"antonio.junior@example.com",
            revisores:["SonarQube"],
            revisoes: [{
                data: removerFinal(new Date().toISOString()),
                revisor: "SonarQube",
                sexoRevisor: undefined,
                tipoRevisao: "sem revisão"
            }],
            historico:[":ok: Commit não terá revisão: commit de merge sem conflito."]
        }
    ];
    expect(commits).to.deep.equal(expected);
}