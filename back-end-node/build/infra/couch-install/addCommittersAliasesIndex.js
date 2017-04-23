"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const criarView_1 = require("./criarView");
function addCommittersAliasesIndex() {
    return criarView_1.criarView('committers_aliases_index', function (doc) {
        if (doc.type === 'committer' && doc.aliases) {
            for (var i = 0; i < doc.aliases.length; i++) {
                emit(doc.aliases[i]);
            }
        }
    });
}
exports.addCommittersAliasesIndex = addCommittersAliasesIndex;
