const Utils = require('../util/Utils');
const sesol2Repository = require('../domain/Sesol2Repository');
const Committer = require('../domain/Committer');

const GitLabService = require('../gitlab/GitLabService').GitLabService;

function getCommittersDosUltimosCommits() {
    return GitLabService.getCommits().then(commits => {
        console.log(`Processando COMMITTERS...`);

        console.log(`\tCarregrando committers de ${commits.length} commits...`);
        let committersHash = {};
        commits.forEach(commit => {
            committersHash[commit.author_email] = true;
        });
        const committers = Object.keys(committersHash);

        return Promise.resolve(committers);
    });
}

function avisarSeUsuarioNaoEncontradoDeManeiraUnica(committerUser, committerEmail) {
    if (committerUser.length !== 1) {

        for (let i = 0; i < 50; i++) {
            console.log('USUARIO NAO ENCONTRADO DE MANEIRA UNICA');
        }
        console.log(committerEmail, committerUser);
        Utils.printBar(2);
    }
    return committerUser[0];
}

function carregarCommitters() {

    return new Promise(resolve => {

        getCommittersDosUltimosCommits().then(committersDosUltimosCommits => {
            let promisesDeCommittersInseridos = [];

            console.log(`\tInserindo, se necessario, ultimos ${committersDosUltimosCommits.length} committers...`);
            committersDosUltimosCommits.forEach(committerEmail => {
                promisesDeCommittersInseridos.push(

                    GitLabService.getUser(committerEmail).then(committerUser => {

                        let userDoGitlab = avisarSeUsuarioNaoEncontradoDeManeiraUnica(committerUser, committerEmail);
                        return sesol2Repository.insertIfNotExists(
                            new Committer(committerEmail, userDoGitlab.name, userDoGitlab.avatar_url)
                        );

                    })

                );
            });

            Promise.all(promisesDeCommittersInseridos).then(resultadosDasPromises => {
                let jahExistiam = 0;
                resultadosDasPromises.forEach(resultadoDePromise => {
                    if (!resultadoDePromise) {
                        jahExistiam++;
                    } else {
                        console.log('\t\t' + resultadoDePromise);
                    }
                });
                console.log(`\tJah existiam: ${jahExistiam}`);
                console.info("Fim da carga de committers!");

                Utils.printBar();
                resolve();
            });
        })

    });
}

module.exports = carregarCommitters;