"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const Committer_1 = require("./Committer");
class CommitterRepository {
    static findCommitterByUsernameOrAlias(usernameOrAlias) {
        return Sesol2Repository_1.sesol2Repository.queryView('committers_aliases_index', Committer_1.Committer.prototype, usernameOrAlias).then((committers) => {
            if (committers.length === 0) {
                return Promise.resolve(Committer_1.Committer.committerInvalido(usernameOrAlias));
            }
            return Promise.resolve(committers[0]);
        });
    }
    static findAllCommitters() {
        return Sesol2Repository_1.sesol2Repository.findAll(Committer_1.Committer.COMMITTER_TYPE, Committer_1.Committer.prototype);
    }
}
exports.CommitterRepository = CommitterRepository;
