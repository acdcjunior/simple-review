const GitLabConfig = require('./domain/GitLabConfig').GitLabConfig;
const rest = require("./infra/rest");

function comentar(commitSha, comentario) {
    return rest("POST", GitLabConfig.commentsUrl(commitSha), GitLabConfig.privateToken, {
        note: comentario
    });
}

// comentar('00c8cab32f83899624978d07424ce86a370c5acd', 'comentario inserido via node!');

module.exports = comentar;


