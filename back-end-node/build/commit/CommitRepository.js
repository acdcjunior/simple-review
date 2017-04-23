"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sesol2Repository_1 = require("../geral/Sesol2Repository");
const Commit_1 = require("./Commit");
class CommitRepository {
    static findAllCommits() {
        return Sesol2Repository_1.sesol2Repository.findAll(Commit_1.Commit.COMMIT_TYPE, Commit_1.Commit.prototype);
    }
}
exports.CommitRepository = CommitRepository;
