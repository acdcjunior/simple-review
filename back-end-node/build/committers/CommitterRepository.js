"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../domain/Sesol2Repository");
const Committer_1 = require("../domain/Committer");
class CommitterRepository {
    static findCommittersByUsernameOrAlias(usernameOrAlias) {
        return Sesol2Repository_1.sesol2Repository.queryView('committers_aliases_index', usernameOrAlias);
    }
    static findAllCommitters() {
        return Sesol2Repository_1.sesol2Repository.findAll(Committer_1.Committer.COMMITTER_TYPE);
    }
}
exports.CommitterRepository = CommitterRepository;
