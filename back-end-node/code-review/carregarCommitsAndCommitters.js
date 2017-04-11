const sesol2Repository = require('./domain/Sesol2Repository');
const Commit = require('./domain/Commit');
const Committer = require('./domain/Committer');
const GitLab = require('./domain/GitLab');

function printBar() {
    console.log('------------------------------------------------------------');
}

console.log('Iniciando carga de commits e committers...');
printBar();

let gitlab = new GitLab();

let commits = gitlab.getCommits().then(commits => {
    let promisesDeCommitsInseridos = [];

    console.log(`Processando ${commits.length} commits...`);
    let committersHash = {};
    commits.forEach(commit => {
        committersHash[commit.author_email] = true;

        promisesDeCommitsInseridos.push(sesol2Repository.insertIfNotExists(
            new Commit(commit.id, commit.title, commit.message, commit.author_email, commit.created_at)
        ));

    });
    const committers = Object.keys(committersHash);

    return Promise.all(promisesDeCommitsInseridos).then(resultadosDasPromises => {
        let jahExistiam = 0;
        resultadosDasPromises.forEach(resultadoDePromise => {
            if (!resultadoDePromise) {
                jahExistiam++;
            } else {
                console.log(resultadoDePromise);
            }
        });
        console.log(`Jah existiam: ${jahExistiam}`);
        return new Promise(resolve => resolve(committers));
    })
}).then(committers => {
    printBar();
    let promisesDeCommittersInseridos = [];

    console.log(`Processando ${committers.length} committers...`);
    committers.forEach(committerEmail => {
        promisesDeCommittersInseridos.push(
            gitlab.getUser(committerEmail).then(committerUser => {
                committerUser.forEach(user => {
                    promisesDeCommittersInseridos.push(sesol2Repository.insertIfNotExists(
                        new Committer(committerEmail, user.name, user.avatar_url)
                    ));
                });
            })
        );
    });

    Promise.all(promisesDeCommittersInseridos).then(resultadosDasPromises => {
        let jahExistiam = 0;
        resultadosDasPromises.forEach(resultadoDePromise => {
            if (!resultadoDePromise) {
                jahExistiam++;
            } else {
                console.log(resultadoDePromise);
            }
        });
        console.log(`Jah existiam: ${jahExistiam}`);

        printBar();
        console.info("Fim!");
    });
});





