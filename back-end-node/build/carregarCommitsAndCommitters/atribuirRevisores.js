"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Committer_1 = require("../domain/Committer");
const Sesol2Repository_1 = require("../domain/Sesol2Repository");
const arrayShuffle_1 = require("../util/arrayShuffle");
const Revisores_1 = require("./Revisores");
const Commit_1 = require("../domain/Commit");
const Email_1 = require("../geral/Email");
//noinspection JSUnusedLocalSymbols
let debug = {
    log: ((x) => { }) || console.log,
    dir: ((x) => { }) || console.dir,
};
function atribuirRevisores() {
    return Committer_1.Committer.findAll().then((committers) => {
        console.log(`#1 -- Atribuindo Revisores...`);
        const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);
        return Commit_1.Commit.findAll().then((commits) => {
            tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDosCommits(commits);
            const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);
            console.log(`#2 -- Commits sem revisores encontrados: ${commitsSemRevisores.length}`);
            return atribuirRevisoresAosCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor).then(() => {
                console.log('Revisores atribuídos!');
            });
        });
    });
}
exports.atribuirRevisores = atribuirRevisores;
function atribuirRevisoresAosCommits(commitsSemRevisor, tabelaProporcoesDeCadaRevisor) {
    if (commitsSemRevisor.length === 0) {
        return Promise.resolve();
    }
    const commitSemRevisor = commitsSemRevisor[0];
    const commitsSemRevisorRestantes = commitsSemRevisor.slice(1);
    return atribuirRevisoresAoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor).then(() => {
        Sesol2Repository_1.sesol2Repository.insert(commitSemRevisor);
        return atribuirRevisoresAosCommits(commitsSemRevisorRestantes, tabelaProporcoesDeCadaRevisor);
    });
}
function atribuirRevisoresAoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor) {
    return incluirRevisoresMencionadosNaMensagem(commitSemRevisor).then(() => {
        tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDoCommit(commitSemRevisor);
        return incluirRevisorEstagiarioEmCommitDeEstagiario(commitSemRevisor, tabelaProporcoesDeCadaRevisor).then(() => {
            return incluirRevisorServidorDoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor);
        });
    });
}
function incluirRevisorEstagiarioEmCommitDeEstagiario(commitSemRevisor, tabelaProporcoesDeCadaRevisor) {
    // se for commit de estagiario
    if (commitSemRevisor.isCommitDeEstagiario()) {
        // --> verificar se tem pelo menos um revisor estagiario, se nao, add
        if (commitSemRevisor.naoTemNenhumRevisorEstagiario()) {
            const estagiarioMaisVago = tabelaProporcoesDeCadaRevisor.calcularEstagiarioMaisVago(commitSemRevisor);
            return commitSemRevisor.indicarRevisorViaSistema(estagiarioMaisVago).then(() => {
                tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(estagiarioMaisVago);
                return Promise.resolve();
            });
        }
    }
    return Promise.resolve();
}
function incluirRevisorServidorDoCommit(commit, tabelaProporcoesDeCadaRevisor) {
    // todos os commits devem ter pelo menos um revisor servidor
    if (commit.todosOsRevisoresSaoEstagiarios()) {
        const servidorMaisVago = tabelaProporcoesDeCadaRevisor.calcularServidorMaisVago(commit);
        return commit.indicarRevisorViaSistema(servidorMaisVago).then(() => {
            tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(servidorMaisVago);
            return Promise.resolve();
        });
    }
    return Promise.resolve();
}
function incluirRevisoresMencionadosNaMensagem(commitSemRevisor) {
    return extrairEmailsDosRevisoresMencionadosNoCommit(commitSemRevisor).then((revisoresIndicados) => {
        return commitSemRevisor.indicarRevisoresViaMencao(revisoresIndicados);
    });
}
function extrairEmailsDosRevisoresMencionadosNoCommit(commitSemRevisor) {
    const message = commitSemRevisor.message;
    const mencoes = message.match(/@[a-zA-Z.0-9]+/g);
    if (mencoes) {
        return extrairEmailsDeMencoes(mencoes, []);
    }
    return Promise.resolve([]);
}
function extrairEmailsDeMencoes(mencoes, emails) {
    if (mencoes.length === 0) {
        return Promise.resolve(emails);
    }
    const mencao = mencoes[0];
    const mencoesRestantes = mencoes.slice(1);
    return Revisores_1.Revisores.mencaoToEmail(mencao).then((emailRevisor) => {
        emails.push(emailRevisor);
        return Promise.resolve(extrairEmailsDeMencoes(mencoesRestantes, emails));
    });
}
class TabelaProporcoesDeCadaRevisor {
    constructor(committers) {
        this.capacidadeDeRevisoes = {};
        this.contagemRevisoesAtribuidas = {};
        committers.forEach(committer => {
            this.capacidadeDeRevisoes[committer.email] = committer.quota;
        });
        debug.log('#############################################');
        debug.dir(this.capacidadeDeRevisoes);
        debug.log('#############################################');
    }
    atualizarContagemComRevisoresDosCommits(commits) {
        commits.forEach(commit => {
            this.atualizarContagemComRevisoresDoCommit(commit);
        });
    }
    atualizarContagemComRevisoresDoCommit(commit) {
        commit.revisores.forEach(revisor => {
            this.incrementarContagemDoRevisor(new Email_1.Email(revisor));
        });
    }
    incrementarContagemDoRevisor(revisor) {
        this.contagemRevisoesAtribuidas[revisor.email] = this.contagemRevisoesAtribuidasA(revisor.email) + 1;
    }
    calcularEstagiarioMaisVago(commit) {
        return this.calcularRevisorMaisVago(email => email !== commit.author_email && new Email_1.Email(email).isEmailDeEstagiario());
    }
    calcularServidorMaisVago(commit) {
        return this.calcularRevisorMaisVago(email => email !== commit.author_email && new Email_1.Email(email).isEmailDeServidor());
    }
    contagemRevisoesAtribuidasA(email) {
        return this.contagemRevisoesAtribuidas[email] || 0;
    }
    percentualDeOcupacaoDoRevisor(email) {
        return this.contagemRevisoesAtribuidasA(email) / this.capacidadeDeRevisoes[email];
    }
    calcularRevisorMaisVago(funcaoFiltragemPossiveisRevisores) {
        debug.log('--- calcularRevisorMaisVago ---');
        const possiveisRevisores = arrayShuffle_1.ArrayShuffle.arrayShuffle(Object.keys(this.capacidadeDeRevisoes)
            .filter(funcaoFiltragemPossiveisRevisores)
            .filter(email => this.capacidadeDeRevisoes[email] > 0));
        debug.dir(this.contagemRevisoesAtribuidas);
        let emailComMenorPercentualOcupado = possiveisRevisores[0];
        let ocupacaoMenorOcupado = 999999;
        possiveisRevisores.forEach(email => {
            let percentualDeOcupacao = this.percentualDeOcupacaoDoRevisor(email);
            debug.log(`Percentual de ocupacao de ${email}: ${percentualDeOcupacao}     \t\t---- menor atual: ${emailComMenorPercentualOcupado}: ${ocupacaoMenorOcupado}`);
            if (percentualDeOcupacao <= ocupacaoMenorOcupado) {
                emailComMenorPercentualOcupado = email;
                ocupacaoMenorOcupado = percentualDeOcupacao;
            }
        });
        debug.log(`Mais vago é ${emailComMenorPercentualOcupado}`);
        return new Email_1.Email(emailComMenorPercentualOcupado);
    }
}
