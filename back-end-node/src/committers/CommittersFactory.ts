import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";
import {sesol2Repository} from "../geral/Sesol2Repository";
import {Committer} from "./Committer";
import {Email} from "../geral/Email";
import {GitLabCommit} from "../gitlab/GitLabCommit";
import {GitLabImpersonationToken} from "../gitlab/GitLabImpersonationToken";
import {codeReviewConfig, CodeReviewConfigCommitter} from "../geral/CodeReviewConfig";

export class CommittersFactory {

    static carregarCommittersDoArquivo() {
        console.log(`\n\n\tCommittersFactory: Iniciando carga dos committers do projeto.json...`);

        const botMaisCommitters = codeReviewConfig.committers.concat(codeReviewConfig.botComentador);
        console.log(`\t\tCommittersFactory: Inserindo (se nao existirem) bot + ${codeReviewConfig.committers.length} committers...`);
        return Promise.all(botMaisCommitters.map((committer: CodeReviewConfigCommitter) => {
            return GitLabService.getUserByUsername(committer.username).then((gitlabUser: GitLabUser) => {
                if (!gitlabUser) {
                    throw new Error(`CommittersFactory: Commiter de username ${committer.username} não foi encontrado no GitLab!`);
                }
                return GitLabService.criarImpersonationToken(gitlabUser.id).then((gitlabImpersonationToken: GitLabImpersonationToken) => {
                    return sesol2Repository.insertIfNotExists(
                        new Committer(gitlabUser, gitlabImpersonationToken, committer.aliases, committer.quota, committer.sexo)
                    );
                });
            });
        })).then((resultadosDasPromises: string[]) => {
            CommittersFactory.exibirQuantidadeQueJahExistia(resultadosDasPromises);
            console.log(`\tCommittersFactory: projeto.json processado por completo!\n`);
        });
    }

    static carregarCommittersDosUltimosCommits() {
        console.log(`\n\n\tCommittersFactory: Iniciando carga dos committers dos ultimos commits...`);

        return CommittersFactory.getEmailsDosCommittersDosUltimosCommits().then((committersDosUltimosCommits: Email[]) => {
            let promisesDeCommittersInseridos: Promise<any>[] = [];

            console.info(`\t\tCommittersFactory: Inserindo (se nao existirem) ultimos ${committersDosUltimosCommits.length} committers...`);
            committersDosUltimosCommits.forEach((committerEmail: Email) => {
                console.info(`\t\t\tCommittersFactory: Inserindo commiter de email ${committerEmail.email}...`);
                promisesDeCommittersInseridos.push(
                    GitLabService.getUserByEmail(committerEmail).then((gitlabUser: GitLabUser) => {
                        if (!gitlabUser) {
                            throw new Error(`CommittersFactory: Commiter de email ${committerEmail.email} não foi encontrado no GitLab!`);
                        }
                        console.info(`\t\t\t\tCommittersFactory: commiter de email ${committerEmail.email} encontrado com o username ${gitlabUser.username} e email ${gitlabUser.email}...`);
                        return GitLabService.criarImpersonationToken(gitlabUser.id).then((gitlabImpersonationToken: GitLabImpersonationToken) => {
                            return sesol2Repository.insertIfNotExists(
                                new Committer(gitlabUser, gitlabImpersonationToken)
                            );
                        });
                    }).catch((e) => {
                        console.error('####################################################################################################');
                        console.error(e.message);
                        console.error('####################################################################################################');
                        return Promise.resolve();
                    })
                );
            });

            return Promise.all(promisesDeCommittersInseridos).then((resultadosDasPromises: string[]) => {
                CommittersFactory.exibirQuantidadeQueJahExistia(resultadosDasPromises);
                console.log("\tCommittersFactory: committers dos ultimos commits processados por completo!\n\n");
            });
        });
    }

    private static exibirQuantidadeQueJahExistia(resultadosDasPromises: string[]) {
        let jahExistiam = 0;
        resultadosDasPromises.forEach(resultadoDePromise => {
            if (!resultadoDePromise) {
                jahExistiam++;
            } else {
                console.info('\t\t\tCommittersFactory: ' + resultadoDePromise);
            }
        });
        console.info(`\t\tCommittersFactory: Jah existiam: ${jahExistiam}`);
    }

    static getEmailsDosCommittersDosUltimosCommits(): Promise<Email[]> {
        return GitLabService.getCommits(100).then((commits: GitLabCommit[]) => {
            console.log(`\t\tCommittersFactory: Carregando committers de ${commits.length} commits...`);

            let committersHash = {};
            commits.forEach(commit => {
                const emailCorrigido = Email.corrigirEmail(commit.author_email);
                committersHash[emailCorrigido] = true;
            });

            return Object.keys(committersHash).map(c => new Email(c));
        });
    }

}
