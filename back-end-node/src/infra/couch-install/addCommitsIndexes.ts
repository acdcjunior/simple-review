import {criarView} from './criarView';

declare function emit(any);

export function addCommitsIndexes() {

    return criarView(
        'commits_index',
        function (doc) {
            if (doc.type === 'commit') {
                emit(doc.created_at);
            }
        }
    ).then(() => {
        return criarView(
            'commits_revisados_nao_index',
            function (commit) {
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
            }
        );
    });

}