"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const criarView_1 = require("./criarView");
function addCommitsIndexes() {
    return criarView_1.criarView('commits_index', function (doc) {
        if (doc.type === 'commit') {
            emit(doc.created_at);
        }
    }).then(() => {
        return criarView_1.criarView('commits_revisados_nao_index', function (commit) {
            if (commit.type === 'commit') {
                var revisoresPendentes = commit.revisores.length;
                for (var i = 0; i < commit.revisoes.length; i++) {
                    var revisor = commit.revisoes[i].revisor;
                    if (commit.revisores.indexOf(revisor) !== -1) {
                        revisoresPendentes--;
                    }
                }
                var commitRevisado = revisoresPendentes <= 0;
                if (!commitRevisado) {
                    emit(commit.created_at);
                }
            }
        });
    });
}
exports.addCommitsIndexes = addCommitsIndexes;
