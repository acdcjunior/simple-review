const Utils = require('../util/Utils');

const sesol2Repository = require('../domain/Sesol2Repository');
const Commit = require('../domain/Commit');

const atribuirRevisores = require('./atribuirRevisores');

const GitLabService = require('../gitlab/GitLabService').GitLabService;

function carregarCommits() {

    return GitLabService.getCommits().then(commits => {
        const promisesDeCommitsInseridos = [];

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
            Utils.printBar();

            atribuirRevisores();
        });
    });

}

module.exports = carregarCommits;