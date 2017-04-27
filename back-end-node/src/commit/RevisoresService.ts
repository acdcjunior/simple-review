import {Committer} from "../committers/Committer";
import {sesol2Repository} from "../geral/Sesol2Repository";
import {ArrayShuffle} from "../geral/arrayShuffle";
import {Commit} from "./Commit";
import {Email} from '../geral/Email';
import {CommitterRepository} from "../committers/CommitterRepository";
import {CommitRepository} from "./CommitRepository";

//noinspection JSUnusedLocalSymbols
let debug = {
    log: ((x) => {}) || console.log,
    dir: ((x) => {}) || console.dir,
};

export class RevisoresService {

    static atribuirRevisores() {
        return CommitterRepository.findAllCommitters().then((committers: Committer[]) => {
            console.log(`\n\nRevisoresService: Atribuindo Revisores...`);
            const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);

            console.log(`\tRevisoresService: TabelaProporcoesDeCadaRevisor construida`);
            return CommitRepository.findAllCommits().then((commits: Commit[]) => {
                console.log(`\tRevisoresService: Commits encontrados (${commits.length})`);
                tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDosCommits(commits);

                const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);
                console.log(`RevisoresService: Commits sem revisores encontrados: ${commitsSemRevisores.length}`);

                return atribuirRevisoresAosCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor).then(() => {
                    console.log('RevisoresService: Revisores atribuídos!');
                });
            });
        });
    }

}

function atribuirRevisoresAosCommits(commitsSemRevisor: Commit[], tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor) {
    if (commitsSemRevisor.length === 0) {
        return Promise.resolve();
    }
    const commitSemRevisor = commitsSemRevisor[0];
    const commitsSemRevisorRestantes = commitsSemRevisor.slice(1);
    return atribuirRevisoresAoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor).then(() => {
        sesol2Repository.insert(commitSemRevisor);
        return atribuirRevisoresAosCommits(commitsSemRevisorRestantes, tabelaProporcoesDeCadaRevisor);
    });
}

function atribuirRevisoresAoCommit(commitSemRevisor: Commit, tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor): Promise<any> {

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

function incluirRevisorEstagiarioEmCommitDeEstagiario(commitSemRevisor: Commit, tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor): Promise<void> {
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

function incluirRevisorServidorDoCommit(commit: Commit, tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor): Promise<void> {
    // todos os commits devem ter pelo menos um revisor servidor
    if (commit.todosOsRevisoresSaoEstagiarios()) {
        const servidorMaisVago: Committer = tabelaProporcoesDeCadaRevisor.calcularServidorMaisVago(commit);
        return commit.indicarRevisorViaSistema(servidorMaisVago).then(() => {
            tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(servidorMaisVago);
            return Promise.resolve();
        });
    }
    return Promise.resolve();
}

function incluirRevisoresMencionadosNaMensagem(commitSemRevisor: Commit): Promise<void> {
    return extrairCommittersMencionadosNaMsgDoCommit(commitSemRevisor).then((revisoresIndicados: Committer[]) => {
        return commitSemRevisor.indicarRevisoresViaMencao(revisoresIndicados);
    });
}

function extrairCommittersMencionadosNaMsgDoCommit(commitSemRevisor): Promise<Committer[]> {
    const message = commitSemRevisor.message;
    const mencoes = message.match(/@[a-zA-Z.0-9]+/g);
    if (mencoes) {
        return extrairCommittersDeMencoes(mencoes, []);
    }
    return Promise.resolve([]);
}

function extrairCommittersDeMencoes(mencoes, committers: Committer[]): Promise<Committer[]> {
    if (mencoes.length === 0) {
        return Promise.resolve(committers);
    }
    const mencao = mencoes[0].substring(1); // tirar a @
    const mencoesRestantes = mencoes.slice(1);
    return CommitterRepository.findCommittersByUsernameOrAlias(mencao).then((committer: Committer) => {
        committers.push(committer);
        return Promise.resolve(extrairCommittersDeMencoes(mencoesRestantes, committers));
    });
}

class TabelaProporcoesDeCadaRevisor {

    private committersHash: any = {};
    private contagemRevisoesAtribuidas: any = {};

    constructor(committers: Committer[]) {
        committers.forEach(committer => {
            this.committersHash[committer.email] = committer;
        });
    }

    atualizarContagemComRevisoresDosCommits(commits: Commit[]) {
        commits.forEach(commit => {
            this.atualizarContagemComRevisoresDoCommit(commit);
        });
    }

    atualizarContagemComRevisoresDoCommit(commit: Commit) {
        commit.revisores.forEach((emailRevisor: string) => {
            if (emailRevisor === Commit.EMAIL_NAO_TERAH_REVISOR) {
                return;
            }
            this.incrementarContagemDoRevisor(this.committersHash[emailRevisor]);
        })
    }

    incrementarContagemDoRevisor(revisor: Committer) {
        this.contagemRevisoesAtribuidas[revisor.email] = this.contagemRevisoesAtribuidasA(revisor.email) + 1;
    }

    calcularEstagiarioMaisVago(commit: Commit): Committer {
        return this.calcularRevisorMaisVago(
            (email: string) => email !== commit.author_email && new Email(email).isEmailDeEstagiario(),
        );
    }

    calcularServidorMaisVago(commit: Commit): Committer {
        return this.calcularRevisorMaisVago(
            (email: string) => email !== commit.author_email && new Email(email).isEmailDeServidor(),
        );
    }

    contagemRevisoesAtribuidasA(email: string) {
        return this.contagemRevisoesAtribuidas[email] || 0
    }
    percentualDeOcupacaoDoRevisor(email: string) {
        return this.contagemRevisoesAtribuidasA(email) / this.committersHash[email].quota;
    }

    calcularRevisorMaisVago(funcaoFiltragemPossiveisRevisores: (email: string) => boolean): Committer {
        debug.log('--- calcularRevisorMaisVago ---');
        const possiveisRevisores = ArrayShuffle.arrayShuffle(
            Object.keys(this.committersHash)
            .filter(funcaoFiltragemPossiveisRevisores)
            .filter(email => this.committersHash[email].quota > 0)
        );

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