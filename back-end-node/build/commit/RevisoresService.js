"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const ArrayUtils_1 = require("../geral/ArrayUtils");
const Email_1 = require("../geral/Email");
const CommitterRepository_1 = require("../committers/CommitterRepository");
const CommitRepository_1 = require("./CommitRepository");
const MencoesExtractor_1 = require("../geral/MencoesExtractor");
//noinspection JSUnusedLocalSymbols
let debug = {
    log: ((x) => { }) || console.log,
    dir: ((x) => { }) || console.dir,
};
class RevisoresService {
    static atribuirRevisores() {
        return __awaiter(this, void 0, void 0, function* () {
            let committers = yield CommitterRepository_1.CommitterRepository.findAllCommitters();
            console.log(`\n\n\tRevisoresService: Atribuindo Revisores...`);
            const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);
            console.log(`\t\tRevisoresService: TabelaProporcoesDeCadaRevisor construida`);
            let commits = yield CommitRepository_1.CommitRepository.findAllCommits();
            console.log(`\t\tRevisoresService: Commits encontrados: ${commits.length}`);
            tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDosCommits(commits);
            const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);
            console.log(`\t\tRevisoresService: Commits sem revisores encontrados: ${commitsSemRevisores.length}`);
            yield atribuirRevisoresAosCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor);
            console.log('\tRevisoresService: Revisores atribuídos!');
        });
    }
}
exports.RevisoresService = RevisoresService;
function atribuirRevisoresAosCommits(commitsSemRevisor, tabelaProporcoesDeCadaRevisor) {
    return __awaiter(this, void 0, void 0, function* () {
        if (commitsSemRevisor.length === 0) {
            return Promise.resolve();
        }
        const commitSemRevisor = commitsSemRevisor[0];
        const commitsSemRevisorRestantes = commitsSemRevisor.slice(1);
        yield atribuirRevisoresAoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor);
        Sesol2Repository_1.sesol2Repository.insert(commitSemRevisor);
        return atribuirRevisoresAosCommits(commitsSemRevisorRestantes, tabelaProporcoesDeCadaRevisor);
    });
}
function atribuirRevisoresAoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor) {
    return __awaiter(this, void 0, void 0, function* () {
        if (commitSemRevisor.isCommitDeMergeSemConflito()) {
            return commitSemRevisor.indicarCommitNaoTerahRevisor('commit de merge sem conflito');
        }
        if (commitSemRevisor.isCommitNaoDeveSerRevisado()) {
            return commitSemRevisor.indicarCommitNaoTerahRevisor('commit indicado para não ter revisão');
        }
        yield incluirRevisoresMencionadosNaMensagem(commitSemRevisor);
        tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDoCommit(commitSemRevisor);
        yield incluirRevisorEstagiarioEmCommitDeEstagiario(commitSemRevisor, tabelaProporcoesDeCadaRevisor);
        return incluirRevisorServidorDoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor);
    });
}
function incluirRevisorEstagiarioEmCommitDeEstagiario(commitSemRevisor, tabelaProporcoesDeCadaRevisor) {
    return __awaiter(this, void 0, void 0, function* () {
        // se for commit de estagiario
        if (commitSemRevisor.isCommitDeEstagiario()) {
            // --> verificar se tem pelo menos um revisor estagiario, se nao, add
            if (commitSemRevisor.naoTemNenhumRevisorEstagiario()) {
                const estagiarioMaisVago = tabelaProporcoesDeCadaRevisor.calcularEstagiarioMaisVago(commitSemRevisor);
                yield commitSemRevisor.indicarRevisorViaSistema(estagiarioMaisVago);
                tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(estagiarioMaisVago);
            }
        }
        return Promise.resolve();
    });
}
function incluirRevisorServidorDoCommit(commit, tabelaProporcoesDeCadaRevisor) {
    return __awaiter(this, void 0, void 0, function* () {
        // todos os commits devem ter pelo menos um revisor servidor
        if (commit.todosOsRevisoresSaoEstagiarios()) {
            const servidorMaisVago = tabelaProporcoesDeCadaRevisor.calcularServidorMaisVago(commit);
            yield commit.indicarRevisorViaSistema(servidorMaisVago);
            tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(servidorMaisVago);
        }
        return Promise.resolve();
    });
}
function incluirRevisoresMencionadosNaMensagem(commitSemRevisor) {
    return __awaiter(this, void 0, void 0, function* () {
        let revisoresIndicados = yield MencoesExtractor_1.MencoesExtractor.extrairCommittersMencionadosNaMensagemDoCommit(commitSemRevisor);
        return commitSemRevisor.indicarRevisoresViaMencao(revisoresIndicados);
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
            const committer = this.committersHash[emailRevisor];
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
        const possiveisRevisores = ArrayUtils_1.ArrayUtils.arrayShuffle(Object.keys(this.committersHash)
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
