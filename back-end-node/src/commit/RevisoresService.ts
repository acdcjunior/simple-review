import {Committer} from "../committers/Committer";
import {sesol2Repository} from "../geral/Sesol2Repository";
import {ArrayUtils} from "../geral/ArrayUtils";
import {Commit} from "./Commit";
import {Email} from '../geral/Email';
import {CommitterRepository} from "../committers/CommitterRepository";
import {CommitRepository} from "./CommitRepository";
import {MencoesExtractor} from "../geral/MencoesExtractor";

//noinspection JSUnusedLocalSymbols
let debug = {
    log: ((x) => {}) || console.log,
    dir: ((x) => {}) || console.dir,
};

export class RevisoresService {

    static async atribuirRevisores() {
        let committers: Committer[] = await CommitterRepository.findAllCommitters();
        console.log(`\n\n\tRevisoresService: Atribuindo Revisores...`);
        const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);

        console.log(`\t\tRevisoresService: TabelaProporcoesDeCadaRevisor construida`);
        let commits: Commit[] = await CommitRepository.findAllCommits();

        console.log(`\t\tRevisoresService: Commits encontrados: ${commits.length}`);
        tabelaProporcoesDeCadaRevisor.atualizarContagemComRevisoresDosCommits(commits);

        const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);
        console.log(`\t\tRevisoresService: Commits sem revisores encontrados: ${commitsSemRevisores.length}`);

        await atribuirRevisoresAosCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor);
        console.log('\tRevisoresService: Revisores atribuídos!');
    }

}

async function atribuirRevisoresAosCommits(commitsSemRevisor: Commit[], tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor): Promise<any> {
    if (commitsSemRevisor.length === 0) {
        return Promise.resolve();
    }
    const commitSemRevisor = commitsSemRevisor[0];
    const commitsSemRevisorRestantes = commitsSemRevisor.slice(1);
    await atribuirRevisoresAoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor);
    sesol2Repository.insert(commitSemRevisor);
    return atribuirRevisoresAosCommits(commitsSemRevisorRestantes, tabelaProporcoesDeCadaRevisor);
}

async function atribuirRevisoresAoCommit(commitSemRevisor: Commit, tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor): Promise<any> {

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

async function incluirRevisorEstagiarioEmCommitDeEstagiario(commitSemRevisor: Commit, tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor): Promise<void> {
    // se for commit de estagiario
    if (commitSemRevisor.isCommitDeEstagiario()) {
        // --> verificar se tem pelo menos um revisor estagiario, se nao, add
        if (commitSemRevisor.naoTemNenhumRevisorEstagiario()) {
            const estagiarioMaisVago = tabelaProporcoesDeCadaRevisor.calcularEstagiarioMaisVago(commitSemRevisor);
            await commitSemRevisor.indicarRevisorViaSistema(estagiarioMaisVago);
            tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(estagiarioMaisVago);
        }
    }
    return Promise.resolve();
}

async function incluirRevisorServidorDoCommit(commit: Commit, tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor): Promise<void> {
    // todos os commits devem ter pelo menos um revisor servidor
    if (commit.todosOsRevisoresSaoEstagiarios()) {
        const servidorMaisVago: Committer = tabelaProporcoesDeCadaRevisor.calcularServidorMaisVago(commit);
        await commit.indicarRevisorViaSistema(servidorMaisVago);
        tabelaProporcoesDeCadaRevisor.incrementarContagemDoRevisor(servidorMaisVago);
    }
    return Promise.resolve();
}

async function incluirRevisoresMencionadosNaMensagem(commitSemRevisor: Commit): Promise<void> {
    let revisoresIndicados: Committer[] = await MencoesExtractor.extrairCommittersMencionadosNaMensagemDoCommit(commitSemRevisor);
    return commitSemRevisor.indicarRevisoresViaMencao(revisoresIndicados);
}

class TabelaProporcoesDeCadaRevisor {

    private committersMap: Map<string, Committer> = new Map<string, Committer>();
    private contagemRevisoesAtribuidas: any = {};

    constructor(committers: Committer[]) {
        committers.forEach(committer => {
            this.committersMap.set(committer.email, committer);
        });
    }

    atualizarContagemComRevisoresDosCommits(commits: Commit[]) {
        commits.forEach(commit => {
            this.atualizarContagemComRevisoresDoCommit(commit);
        });
    }

    atualizarContagemComRevisoresDoCommit(commit: Commit) {
        commit.revisores.forEach((emailRevisor: string) => {
            const committer = this.committersMap.get(emailRevisor);
            if (!committer) {
                console.log(`\t\tRevisoresService: Commiter do email ${emailRevisor} nao encontrado: `, committer);
            }
            this.incrementarContagemDoRevisor(committer);
        })
    }

    incrementarContagemDoRevisor(revisor: Committer) {
        this.contagemRevisoesAtribuidas[revisor.email] = this.contagemRevisoesAtribuidasA(revisor.email) + 1;
    }

    calcularEstagiarioMaisVago(commit: Commit): Committer {
        return this.calcularRevisorMaisVago(
            (email: string) => email !== commit.author_email && Email.ehEmailDeEstagiario(email),
        );
    }

    calcularServidorMaisVago(commit: Commit): Committer {
        return this.calcularRevisorMaisVago(
            (email: string) => email !== commit.author_email && Email.ehEmailDeServidor(email),
        );
    }

    contagemRevisoesAtribuidasA(email: string) {
        return this.contagemRevisoesAtribuidas[email] || 0
    }
    percentualDeOcupacaoDoRevisor(email: string) {
        return this.contagemRevisoesAtribuidasA(email) / this.committersMap.get(email).quota;
    }

    calcularRevisorMaisVago(funcaoFiltragemPossiveisRevisores: (email: string) => boolean): Committer {
        debug.log('--- calcularRevisorMaisVago ---');

        const possiveisRevisores = ArrayUtils.arrayShuffle(
            Array.from(this.committersMap.keys())
            .filter(funcaoFiltragemPossiveisRevisores)
            .filter(email => this.committersMap.get(email).quota > 0)
        );

        debug.dir(this.contagemRevisoesAtribuidas);

        let emailComMenorPercentualOcupado = possiveisRevisores[0];
        let ocupacaoMenorOcupado = 999999;

        let posicoes = [];
        possiveisRevisores.forEach((emailPossivelRevisor: string) => {
            const committer = this.committersMap.get(emailPossivelRevisor);
            for(let i = 0; i < committer.quota; i++) {
                posicoes.push(committer);
            }
        });

        let randomCommitter = posicoes[Math.floor(Math.random()*posicoes.length)];

        if ("x"!==randomCommitter) {
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