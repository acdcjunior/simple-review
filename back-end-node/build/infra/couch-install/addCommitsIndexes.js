"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const criarView_1 = require("./criarView");
function addCommitsIndexes() {
    return criarView_1.criarView('commits_index', function (doc) {
        if (doc.type === 'commit') {
            emit(doc.created_at);
        }
    }).then(() => {
        return criarView_1.criarView('commits_pendendo_revisao_do_revisor', function (commit) {
            if (commit.type === 'commit') {
                var revisoresPendentes = commit.revisores.splice(0);
                for (var i = 0; i < commit.revisoes.length; i++) {
                    var revisor = commit.revisoes[i].revisor;
                    var index = revisoresPendentes.indexOf(revisor);
                    if (index > -1) {
                        revisoresPendentes.splice(index, 1);
                    }
                }
                for (var j = 0; j < revisoresPendentes.length; j++) {
                    emit([revisoresPendentes[j], commit.created_at]);
                }
            }
        });
    }).then(() => {
        return criarView_1.criarView('commits_atribuidos_para_revisao_do_revisor', function (commit) {
            if (commit.type === 'commit') {
                for (var i = 0; i < commit.revisores.length; i++) {
                    emit([commit.revisores[i], commit.created_at]);
                }
            }
        });
    });
}
exports.addCommitsIndexes = addCommitsIndexes;
