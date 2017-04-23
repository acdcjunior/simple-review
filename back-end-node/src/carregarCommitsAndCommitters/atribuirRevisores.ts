import {Committer} from "../domain/Committer";
import {sesol2Repository} from "../domain/Sesol2Repository";
import {ArrayShuffle} from "../util/arrayShuffle";
import {Revisores} from "./Revisores";
import {Commit} from "../domain/Commit";
import {Email} from '../geral/Email';
import {CommitterRepository} from "../committers/CommitterRepository";

//noinspection JSUnusedLocalSymbols
let debug = {
    log: ((x) => {}) || console.log,
    dir: ((x) => {}) || console.dir,
};

export function atribuirRevisores() {
    return CommitterRepository.findAllCommitters().then((committers: Committer[]) => {

        console.log(`#1 -- Atribuindo Revisores...`);
        const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);

        return Commit.findAll().then((commits: Commit[]) => {

            tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDosCommits(commits);

            const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);

            console.log(`#2 -- Commits sem revisores encontrados: ${commitsSemRevisores.length}`);

            return atribuirRevisoresAosCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor).then(() => {
                console.log('Revisores atribuídos!');
            });
        });
    });
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
        const servidorMaisVago = tabelaProporcoesDeCadaRevisor.calcularServidorMaisVago(commit);
        return commit.indicarRevisorViaSistema(servidorMaisVago).then(() => {
            tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(servidorMaisVago);
            return Promise.resolve();
        });
    }
    return Promise.resolve();
}

function incluirRevisoresMencionadosNaMensagem(commitSemRevisor: Commit): Promise<void> {
    return extrairEmailsDosRevisoresMencionadosNoCommit(commitSemRevisor).then((revisoresIndicados: Email[]) => {
        return commitSemRevisor.indicarRevisoresViaMencao(revisoresIndicados);
    });
}

function extrairEmailsDosRevisoresMencionadosNoCommit(commitSemRevisor): Promise<Email[]> {
    const message = commitSemRevisor.message;
    const mencoes = message.match(/@[a-zA-Z.0-9]+/g);
    if (mencoes) {
        return extrairEmailsDeMencoes(mencoes, []);
    }
    return Promise.resolve([]);
}

function extrairEmailsDeMencoes(mencoes, emails: Email[]): Promise<Email[]> {
    if (mencoes.length === 0) {
        return Promise.resolve(emails);
    }
    const mencao = mencoes[0];
    const mencoesRestantes = mencoes.slice(1);
    return Revisores.mencaoToEmail(mencao).then((emailRevisor: Email) => {
        emails.push(emailRevisor);
        return Promise.resolve(extrairEmailsDeMencoes(mencoesRestantes, emails));
    });
}

class TabelaProporcoesDeCadaRevisor {

    private capacidadeDeRevisoes: any = {};
    private contagemRevisoesAtribuidas: any = {};

    constructor(committers: Committer[]) {
        committers.forEach(committer => {
            this.capacidadeDeRevisoes[committer.email] = committer.quota;
        });
        debug.log('#############################################');
        debug.dir(this.capacidadeDeRevisoes);
        debug.log('#############################################');
    }

    atualizarContagemComRevisoresDosCommits(commits: Commit[]) {
        commits.forEach(commit => {
            this.atualizarContagemComRevisoresDoCommit(commit);
        });
    }

    atualizarContagemComRevisoresDoCommit(commit: Commit) {
        commit.revisores.forEach(revisor => {
            this.incrementarContagemDoRevisor(new Email(revisor));
        })
    }

    incrementarContagemDoRevisor(revisor: Email) {
        this.contagemRevisoesAtribuidas[revisor.email] = this.contagemRevisoesAtribuidasA(revisor.email) + 1;
    }

    calcularEstagiarioMaisVago(commit: Commit): Email {
        return this.calcularRevisorMaisVago(
            email => email !== commit.author_email && new Email(email).isEmailDeEstagiario(),
        );
    }

    calcularServidorMaisVago(commit: Commit): Email {
        return this.calcularRevisorMaisVago(
            email => email !== commit.author_email && new Email(email).isEmailDeServidor(),
        );
    }

    contagemRevisoesAtribuidasA(email: string) {
        return this.contagemRevisoesAtribuidas[email] || 0
    }
    percentualDeOcupacaoDoRevisor(email: string) {
        return this.contagemRevisoesAtribuidasA(email) / this.capacidadeDeRevisoes[email];
    }

    calcularRevisorMaisVago(funcaoFiltragemPossiveisRevisores): Email {
        debug.log('--- calcularRevisorMaisVago ---');
        const possiveisRevisores = ArrayShuffle.arrayShuffle(
            Object.keys(this.capacidadeDeRevisoes)
            .filter(funcaoFiltragemPossiveisRevisores)
            .filter(email => this.capacidadeDeRevisoes[email] > 0)
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
        return new Email(emailComMenorPercentualOcupado);
    }


}