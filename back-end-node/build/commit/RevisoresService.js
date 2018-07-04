"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const ArrayUtils_1 = require("../geral/ArrayUtils");
const Email_1 = require("../geral/Email");
const CommitterRepository_1 = require("../committers/CommitterRepository");
const CommitRepository_1 = require("./CommitRepository");
const MencoesExtractor_1 = require("../geral/MencoesExtractor");
//noinspection JSUnusedLocalSymbols
let debug = {
    log: /*((x) => {}) ||*/ console.log,
    dir: /*((x) => {}) ||*/ console.dir,
};
class RevisoresService {
    static async atribuirRevisores() {
        let committers = await CommitterRepository_1.CommitterRepository.findAllCommitters();
        console.log(`\n\n\tRevisoresService: Atribuindo Revisores...`);
        const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);
        console.log(`\t\tRevisoresService: TabelaProporcoesDeCadaRevisor construida`);
        let commits = await CommitRepository_1.CommitRepository.findAllCommits();
        console.log(`\t\tRevisoresService: Commits encontrados: ${commits.length}`);
        tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDosCommits(commits);
        const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);
        console.log(`\t\tRevisoresService: Commits sem revisores encontrados: ${commitsSemRevisores.length}`);
        await atribuirRevisoresAosCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor);
        console.log('\tRevisoresService: Revisores atribuídos!');
    }
}
exports.RevisoresService = RevisoresService;
async function atribuirRevisoresAosCommits(commitsSemRevisor, tabelaProporcoesDeCadaRevisor) {
    if (commitsSemRevisor.length === 0) {
        return Promise.resolve();
    }
    const commitSemRevisor = commitsSemRevisor[0];
    const commitsSemRevisorRestantes = commitsSemRevisor.slice(1);
    await atribuirRevisoresAoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor);
    Sesol2Repository_1.sesol2Repository.insert(commitSemRevisor);
    return atribuirRevisoresAosCommits(commitsSemRevisorRestantes, tabelaProporcoesDeCadaRevisor);
}
async function atribuirRevisoresAoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor) {
    try {
        if (commitSemRevisor.isCommitDeMergeSemConflito()) {
            return commitSemRevisor.indicarCommitNaoTerahRevisor('commit de merge sem conflito');
        }
        if (commitSemRevisor.isCommitNaoDeveSerRevisado()) {
            return commitSemRevisor.indicarCommitNaoTerahRevisor('commit indicado para não ter revisão');
        }
        await incluirRevisoresMencionadosNaMensagem(commitSemRevisor);
        tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDoCommit(commitSemRevisor);
        await incluirRevisorEstagiarioEmCommitDeEstagiario(commitSemRevisor, tabelaProporcoesDeCadaRevisor);
        return incluirRevisorServidorDoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor);
    }
    catch (e) {
        console.log(`Erro ao atribuir revisores ao commit.`, { commitSemRevisor, e });
    }
}
async function incluirRevisorEstagiarioEmCommitDeEstagiario(commitSemRevisor, tabelaProporcoesDeCadaRevisor) {
    // se for commit de estagiario
    if (commitSemRevisor.isCommitDeEstagiario()) {
        // --> verificar se tem pelo menos um revisor estagiario, se nao, add
        if (commitSemRevisor.naoTemNenhumRevisorEstagiario()) {
            const estagiarioMaisVago = tabelaProporcoesDeCadaRevisor.calcularEstagiarioMaisVago(commitSemRevisor);
            await commitSemRevisor.indicarRevisorViaSistema(estagiarioMaisVago);
            tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(estagiarioMaisVago);
        }
    }
}
async function incluirRevisorServidorDoCommit(commit, tabelaProporcoesDeCadaRevisor) {
    // todos os commits devem ter pelo menos um revisor servidor
    if (commit.todosOsRevisoresSaoEstagiarios()) {
        const servidorMaisVago = tabelaProporcoesDeCadaRevisor.calcularServidorMaisVago(commit);
        await commit.indicarRevisorViaSistema(servidorMaisVago);
        tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(servidorMaisVago);
    }
}
async function incluirRevisoresMencionadosNaMensagem(commitSemRevisor) {
    let revisoresIndicados = await MencoesExtractor_1.MencoesExtractor.extrairCommittersMencionadosNaMensagemDoCommit(commitSemRevisor);
    return commitSemRevisor.indicarRevisoresViaMencao(revisoresIndicados);
}
class TabelaProporcoesDeCadaRevisor {
    constructor(committers) {
        this.committersMap = new Map();
        this.contagemRevisoesAtribuidas = {};
        committers.forEach(committer => {
            this.committersMap.set(committer.email, committer);
        });
    }
    atualizarContagemComRevisoresDosCommits(commits) {
        commits.forEach(commit => {
            this.atualizarContagemComRevisoresDoCommit(commit);
        });
    }
    atualizarContagemComRevisoresDoCommit(commit) {
        commit.revisores.forEach((emailRevisor) => {
            const committer = this.committersMap.get(emailRevisor);
            if (!committer) {
                console.log(`\t\tRevisoresService: Commiter do email ${emailRevisor} nao encontrado: `, committer);
            }
            this.incrementarContagemDoRevisor(committer);
        });
    }
    incrementarContagemDoRevisor(revisor) {
        this.contagemRevisoesAtribuidas[revisor.email] = this.contagemRevisoesAtribuidasA(revisor.email) + 1;
    }
    calcularEstagiarioMaisVago(commit) {
        return this.calcularRevisorMaisVago((email) => email !== commit.author_email && Email_1.Email.ehEmailDeEstagiario(email));
    }
    calcularServidorMaisVago(commit) {
        return this.calcularRevisorMaisVago((email) => email !== commit.author_email && Email_1.Email.ehEmailDeServidor(email));
    }
    contagemRevisoesAtribuidasA(email) {
        return this.contagemRevisoesAtribuidas[email] || 0;
    }
    percentualDeOcupacaoDoRevisor(email) {
        return this.contagemRevisoesAtribuidasA(email) / this.committersMap.get(email).quota;
    }
    calcularRevisorMaisVago(funcaoFiltragemPossiveisRevisores) {
        debug.log('--- calcularRevisorMaisVago ---');
        const possiveisRevisores = ArrayUtils_1.ArrayUtils.arrayShuffle(Array.from(this.committersMap.keys())
            .filter(funcaoFiltragemPossiveisRevisores)
            .filter(email => this.committersMap.get(email).quota > 0));
        debug.dir(this.contagemRevisoesAtribuidas);
        let emailComMenorPercentualOcupado = possiveisRevisores[0];
        let ocupacaoMenorOcupado = 999999;
        let posicoes = [];
        possiveisRevisores.forEach((emailPossivelRevisor) => {
            const committer = this.committersMap.get(emailPossivelRevisor);
            for (let i = 0; i < committer.quota; i++) {
                posicoes.push(committer);
            }
        });
        let randomCommitter = posicoes[Math.floor(Math.random() * posicoes.length)];
        if ("x" !== randomCommitter) {
            return randomCommitter;
        }
        possiveisRevisores.forEach(email => {
            let percentualDeOcupacao = this.percentualDeOcupacaoDoRevisor(email);
            debug.log(`Percentual de ocupacao de ${email}: ${percentualDeOcupacao}     \t\t---- menor atual: ${emailComMenorPercentualOcupado}: ${ocupacaoMenorOcupado}`);
            if (percentualDeOcupacao <= ocupacaoMenorOcupado) {
                emailComMenorPercentualOcupado = email;
                ocupacaoMenorOcupado = percentualDeOcupacao;
            }
        });
        debug.log(`Mais vago é ${emailComMenorPercentualOcupado}`);
        return this.committersMap.get(emailComMenorPercentualOcupado);
    }
}
