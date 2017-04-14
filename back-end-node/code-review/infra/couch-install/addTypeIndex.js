const criarView = require('./criarView');

function addTypeIndex() {

    return criarView(
        'type_index',
        function (doc) {
            emit(doc.type);
        }
    );

}

module.exports = addTypeIndex;