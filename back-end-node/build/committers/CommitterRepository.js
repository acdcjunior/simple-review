"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const Committer_1 = require("./Committer");
const CodeReviewConfig_1 = require("../geral/CodeReviewConfig");
class CommitterRepository {
    static findBotComentador() {
        return CommitterRepository.findCommitterByUsernameOrAlias(CodeReviewConfig_1.codeReviewConfig.botComentador.username);
    }
    static findCommitterByUsernameOrAlias(usernameOrAlias) {
        return Sesol2Repository_1.sesol2Repository.queryView('committers_aliases_index', Committer_1.Committer.prototype, usernameOrAlias).then((committers) => {
            if (committers.length === 0) {
                return Committer_1.Committer.committerInvalido(usernameOrAlias);
            }
            return committers[0];
        });
    }
    static findAllCommitters() {
        return Sesol2Repository_1.sesol2Repository.findAll(Committer_1.Committer.COMMITTER_TYPE, Committer_1.Committer.prototype);
    }
}
exports.CommitterRepository = CommitterRepository;
