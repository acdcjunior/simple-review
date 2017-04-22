import {Committer} from "../domain/Committer";
import {sesol2Repository} from "../domain/Sesol2Repository";
import {ArrayShuffle} from "../util/arrayShuffle";
import {Revisor} from "../Revisor";
import {Revisores} from "./Revisores";
import {Commit} from "../domain/Commit";
import {Email} from '../geral/Email';


function isEstagiario(authorEmail) {
    return /[xX]\d{11}@tcu.gov.br$/.test(authorEmail);
}

function isServidor(authorEmail) {
    return !isEstagiario(authorEmail);
}

function historicoRevisorIndicado(commitSemRevisor, revisorIndicado) {
    return Revisor.revisorIndicado(commitSemRevisor.sha, revisorIndicado).then(msg => {
        commitSemRevisor.historico.push(msg);
    });
}

function historicoRevisorCalculado(commitSemRevisor, revisorCalculado) {
    return Revisor.revisorCalculado(commitSemRevisor.sha, revisorCalculado).then(msg => {
        commitSemRevisor.historico.push(msg);
    });
}

function extrairEmailsDeMencoes(mencoes, emails: Email[]): Promise<Email[]> {
    if (mencoes.length === 0) {
        return Promise.resolve(emails);
    }
    const mencao = mencoes.pop();
    return Revisores.mencaoToEmail(mencao).then((emailRevisor: Email) => {

        emails.push(emailRevisor);
        return Promise.resolve(extrairEmailsDeMencoes(mencoes, emails));
    });
}

function extrairEmailsDosRevisoresMencionadosNoCommit(hashPercentuaisDeRevisoes, commitSemRevisor): Promise<Email[]> {
    const message = commitSemRevisor.message;
    const mencoes = message.match(/@[a-zA-Z.0-9]+/g);
    if (mencoes) {
        return extrairEmailsDeMencoes(mencoes, []);
    }
    return Promise.resolve([]);
}

function incluirRevisoresMencionadosNaMensagem(commitSemRevisor: Commit,
                                               tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor,
                                               tabelaContagemRevisoesAtribuidas: TabelaContagemRevisoesAtribuidas): Promise<any> {

    return extrairEmailsDosRevisoresMencionadosNoCommit(tabelaProporcoesDeCadaRevisor, commitSemRevisor).then((revisoresIndicados: Email[]) => {
        console.log('revisores indicados', revisoresIndicados);
    });
}

function calcularRevisoresDoCommit(commitSemRevisor: Commit, tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas: TabelaContagemRevisoesAtribuidas): Promise<any> {

    console.log('calcularRevisoresDoCommit', commitSemRevisor);
    return incluirRevisoresMencionadosNaMensagem(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas).then(() => {
        // se for commit de estagiario
        // --> verificar se tem pelo menos um revisor estagiario, se nao, add

        // qualquer caso
        // --> verificar se tem pelo menos um revisor servidor
    });


    // return incluirRevisores(commitSemRevisor, tabelaProporcoesDeCadaRevisor, revisoresIndicados).then(() => {
    //
    //     let revisorIndicado = revisorIndicadoEmail.asString;
    //     const revisoresAtribuidos = [];
    //
    //     const revisorIndicadoEhEstagiario = revisorIndicado && isEstagiario(revisorIndicado);
    //     const revisorIndicadoEhServidor = revisorIndicado && isServidor(revisorIndicado);
    //
    //     const promises = [];
    //     const ehCommitDeEstagiario = isEstagiario(commitSemRevisor.author_email);
    //     if (ehCommitDeEstagiario) {
    //         if (revisorIndicadoEhEstagiario) {
    //             revisoresAtribuidos.push(revisorIndicado);
    //             promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
    //         } else {
    //             const revisorCalculado = calcularRevisorComBaseNaOcupacao(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas, isEstagiario);
    //             revisoresAtribuidos.push(revisorCalculado);
    //             promises.push(historicoRevisorCalculado(commitSemRevisor, revisorCalculado));
    //         }
    //     } else {
    //         // autor eh servidor, mas ele indicou um estagiario, mesmo assim
    //         if (revisorIndicadoEhEstagiario) {
    //             revisoresAtribuidos.push(revisorIndicado);
    //             promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
    //         }
    //     }
    //
    //     if (revisorIndicadoEhServidor) {
    //         revisoresAtribuidos.push(revisorIndicado);
    //         promises.push(historicoRevisorIndicado(commitSemRevisor, revisorIndicado));
    //     } else {
    //         const revisorCalculado = calcularRevisorComBaseNaOcupacao(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas, isServidor);
    //         revisoresAtribuidos.push(revisorCalculado);
    //         promises.push(historicoRevisorCalculado(commitSemRevisor, revisorCalculado));
    //     }
    //
    //     revisoresAtribuidos.forEach(revisorAtribuido => {
    //         tabelaContagemRevisoesAtribuidas[revisorAtribuido] = (tabelaContagemRevisoesAtribuidas[revisorAtribuido] || 0) + 1;
    //     });
    //     return Promise.all(promises).then(() => {
    //         commitSemRevisor.revisores = revisoresAtribuidos;
    //         return Promise.resolve();
    //     });
    //
    // });

}



function calcularRevisorComBaseNaOcupacao(commitSemRevisor, percentuaisDeRevisoes, revisores, funcaoTipoRevisor) {
    const emails = Object.keys(percentuaisDeRevisoes).filter(funcaoTipoRevisor)
        .filter(email => percentuaisDeRevisoes[email] > 0)
        .filter(email => email !== commitSemRevisor.author_email);

    const emailsMisturados = ArrayShuffle.arrayShuffle(emails);

    let emailComMenorPercentualOcupado = emailsMisturados[0];

    const percentuaisOcupados = {};
    percentuaisOcupados[emailComMenorPercentualOcupado] = -1;

    emailsMisturados.forEach(email => {
        if (!revisores[email]) { // usuario nao eh revisor de nada
            percentuaisOcupados[email] = 0;
        } else {
            percentuaisOcupados[email] = revisores[email] / percentuaisDeRevisoes[email];
        }
        if (percentuaisOcupados[email] <= percentuaisOcupados[emailComMenorPercentualOcupado]) {
            emailComMenorPercentualOcupado = email;
        }
    });

    return emailComMenorPercentualOcupado;
}

class TabelaProporcoesDeCadaRevisor {
    constructor(committers) {
        committers.forEach(committer => {
            this[committer.email] = committer.percentualDeRevisoes;
        });
    }
}

class TabelaContagemRevisoesAtribuidas {
    constructor(commits: Commit[]) {
        commits.forEach(commit => {
            commit.revisores.forEach(revisor => {
                this[revisor] = (this[revisor] || 0) + 1;
            })
        });
    }
}

function calcularParaCommits(commitsSemRevisores: Commit[], tabelaProporcoesDeCadaRevisor: TabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas: TabelaContagemRevisoesAtribuidas) {
    if (commitsSemRevisores.length === 0) {
        return Promise.resolve();
    }
    const commitSemRevisor = commitsSemRevisores.pop();
    return calcularRevisoresDoCommit(commitSemRevisor, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas).then(() => {
        sesol2Repository.insert(commitSemRevisor);
        return calcularParaCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas);
    });
}

export function atribuirRevisores() {
    return Committer.findAll().then(committers => {

        console.log(`#1 -- Atribuindo Revisores...`);
        const tabelaProporcoesDeCadaRevisor = new TabelaProporcoesDeCadaRevisor(committers);

        return Commit.findAll().then((commits: Commit[]) => {

            const tabelaContagemRevisoesAtribuidas = new TabelaContagemRevisoesAtribuidas(commits);
            const commitsSemRevisores = commits.filter(commit => commit.revisores.length === 0);

            console.log(`#2 -- Commits sem revisores encontrados...`);
            return calcularParaCommits(commitsSemRevisores, tabelaProporcoesDeCadaRevisor, tabelaContagemRevisoesAtribuidas).then(() => {
                 console.log('Revisores atribuídos!');
            });
        });
    });
}