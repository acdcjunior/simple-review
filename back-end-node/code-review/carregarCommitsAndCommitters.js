const sesol2Repository = require('./domain/Sesol2Repository');
const Commit = require('./domain/Commit');
const Committer = require('./domain/Committer');
const GitLab = require('./domain/GitLab');
const atribuirRevisores = require('./atribuirRevisores');

function printBar() {
    console.log('------------------------------------------------------------');
}

console.log('Iniciando carga de committers e commits...');
printBar();

let gitlab = new GitLab();

let commits = gitlab.getCommits().then(commits => {
    console.log(`Processando COMMITTERS...`);

    console.log(`\tCarregrando committers de ${commits.length} commits...`);
    let committersHash = {};
    commits.forEach(commit => {
        committersHash[commit.author_email] = true;
    });
    const committers = Object.keys(committersHash);

    return Promise.resolve(committers);
}).then(committers => {
    let promisesDeCommittersInseridos = [];

    console.log(`\tProcessando ${committers.length} committers...`);
    committers.forEach(committerEmail => {
        promisesDeCommittersInseridos.push(
            gitlab.getUser(committerEmail).then(committerUser => {
                if (committerUser.length !== 1) {

                    for (let i = 0; i < 50; i++) {
                        console.log('USUARIO NAO ENCONTRADO DE MANEIRA UNICA');
                    }
                    console.log(committerEmail, committerUser);
                    printBar();
                    printBar();

                    return;
                }
                let user = committerUser[0];
                return sesol2Repository.insertIfNotExists(
                    new Committer(committerEmail, user.name, user.avatar_url)
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

        printBar();
        carregarCommits();
    });
});

function carregarCommits () {
    let commits = gitlab.getCommits().then(commits => {
        let promisesDeCommitsInseridos = [];

        console.log(`Processando COMMITS...`);
        console.log(`\tProcessando ${commits.length} commits...`);
        commits.forEach(commit => {
            promisesDeCommitsInseridos.push(sesol2Repository.insertIfNotExists(
                new Commit(commit.id, commit.title, commit.message, commit.author_email, commit.created_at)
            ));
        });

        return Promise.all(promisesDeCommitsInseridos).then(resultadosDasPromises => {
            let jahExistiam = 0;
            resultadosDasPromises.forEach(resultadoDePromise => {
                if (!resultadoDePromise) {
                    jahExistiam++;
                } else {
                    console.log('\t\t' + resultadoDePromise);
                }
            });
            console.log(`\tJah existiam: ${jahExistiam}`);
            printBar();
            atribuirRevisores();
            console.info("Fim!");
        });
    });
}

