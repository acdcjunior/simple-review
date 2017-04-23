import {criarView} from './criarView';

declare function emit(stuff: any);

export function addCommittersAliasesIndex() {

    return criarView(
        'committers_aliases_index',
        function(doc) {
            if (doc.type === 'committer' && doc.aliases) {
                for (var i = 0; i < doc.aliases.length; i++) {
                    emit(doc.aliases[i]);
                }
            }
        }
    );

}