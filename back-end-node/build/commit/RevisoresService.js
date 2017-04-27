"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const arrayShuffle_1 = require("../geral/arrayShuffle");
const Email_1 = require("../geral/Email");
const CommitterRepository_1 = require("../committers/CommitterRepository");
const CommitRepository_1 = require("./CommitRepository");
//noinspection JSUnusedLocalSymbols
let debug = {
    log: ((x) => { }) || console.log,
    dir: ((x) => { }) || console.dir,
};
class RevisoresService {
    static atribuirRevisores() {
        return CommitterRepository_1.CommitterRepository.findAllCommitters().then((committers) => {
            console.log(`\n\nRevisoresService: Atribuindo Revisores...`);
            const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);
            console.log(`\tRevisoresService: TabelaProporcoesDeCadaRevisor construida`);
            return CommitRepository_1.CommitRepository.findAllCommits().then((commits) => {
                console.log(`\tRevisoresService: Commits encontrados (${commits.length})`);
                tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDosCommits(commits);
                console.log(`\tRevisoresService: atualizarContagemComRevisoresDosCommits() feito`);
                const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);
                console.log(`RevisoresService: Commits sem revisores encontrados: ${commitsSemRevisores.length}`);
                return atribuirRevisoresAosCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor).then(() => {
                    console.log('RevisoresService: Revisores atribuídos!');
                });
            });
        });
    }
}
exports.RevisoresService = RevisoresService;
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
    if (commitSemRevisor.isCommitDeMergeSemConflito()) {
        return commitSemRevisor.indicarCommitNaoTerahRevisor('commit de merge sem conflito');
    }
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
    return extrairCommittersMencionadosNaMsgDoCommit(commitSemRevisor).then((revisoresIndicados) => {
        return commitSemRevisor.indicarRevisoresViaMencao(revisoresIndicados);
    });
}
function extrairCommittersMencionadosNaMsgDoCommit(commitSemRevisor) {
    const message = commitSemRevisor.message;
    const mencoes = message.match(/@[a-zA-Z.0-9]+/g);
    if (mencoes) {
        return extrairCommittersDeMencoes(mencoes, []);
    }
    return Promise.resolve([]);
}
function extrairCommittersDeMencoes(mencoes, committers) {
    if (mencoes.length === 0) {
        return Promise.resolve(committers);
    }
    const mencao = mencoes[0].substring(1); // tirar a @
    const mencoesRestantes = mencoes.slice(1);
    return CommitterRepository_1.CommitterRepository.findCommittersByUsernameOrAlias(mencao).then((committer) => {
        committers.push(committer);
        return Promise.resolve(extrairCommittersDeMencoes(mencoesRestantes, committers));
    });
}
class TabelaProporcoesDeCadaRevisor {
    constructor(committers) {
        this.committersHash = {};
        this.contagemRevisoesAtribuidas = {};
        committers.forEach(committer => {
            this.committersHash[committer.email] = committer;
        });
    }
    atualizarContagemComRevisoresDosCommits(commits) {
        commits.forEach(commit => {
            this.atualizarContagemComRevisoresDoCommit(commit);
        });
    }
    atualizarContagemComRevisoresDoCommit(commit) {
        commit.revisores.forEach((emailRevisor) => {
            console.log(`Incrementando para email: ${emailRevisor}: `, this.committersHash[emailRevisor]);
            console.dir(this.committersHash);
            this.incrementarContagemDoRevisor(this.committersHash[emailRevisor]);
        });
    }
    incrementarContagemDoRevisor(revisor) {
        this.contagemRevisoesAtribuidas[revisor.email] = this.contagemRevisoesAtribuidasA(revisor.email) + 1;
    }
    calcularEstagiarioMaisVago(commit) {
        return this.calcularRevisorMaisVago((email) => email !== commit.author_email && new Email_1.Email(email).isEmailDeEstagiario());
    }
    calcularServidorMaisVago(commit) {
        return this.calcularRevisorMaisVago((email) => email !== commit.author_email && new Email_1.Email(email).isEmailDeServidor());
    }
    contagemRevisoesAtribuidasA(email) {
        return this.contagemRevisoesAtribuidas[email] || 0;
    }
    percentualDeOcupacaoDoRevisor(email) {
        return this.contagemRevisoesAtribuidasA(email) / this.committersHash[email].quota;
    }
    calcularRevisorMaisVago(funcaoFiltragemPossiveisRevisores) {
        debug.log('--- calcularRevisorMaisVago ---');
        const possiveisRevisores = arrayShuffle_1.ArrayShuffle.arrayShuffle(Object.keys(this.committersHash)
            .filter(funcaoFiltragemPossiveisRevisores)
            .filter(email => this.committersHash[email].quota > 0));
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
        return this.committersHash[emailComMenorPercentualOcupado];
    }
}
