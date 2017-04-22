import {criarView} from './criarView';

declare function emit(stuff: any);

export function addTypeIndex() {

    return criarView(
        'type_index',
        function (doc) {
            emit(doc.type);
        }
    );

}