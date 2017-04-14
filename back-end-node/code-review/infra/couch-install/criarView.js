const db = require('../couchdb');

function criarView(nomeIndice, mapFunction) {

    return new Promise(resolve => {

        const index = {
            _id: '_design/' + nomeIndice,
            views: {}
        };
        index.views[nomeIndice] = {
            map: mapFunction.toString()
        };

        db.put(index).then(function () {
            // kick off an initial build, return immediately
            db.query(nomeIndice, {stale: 'update_after'});
            return Promise.resolve(true);
        }).catch(function (err) {
            if (err.status === 409) {
                return Promise.resolve(false);
            }
            console.log('Erro: ', err);
        }).then(function (viewFoiCriada) {
            if (viewFoiCriada) {
                console.log('[' + nomeIndice + '] *** View foi criada.');
            } else {
                console.log('[' + nomeIndice + '] *** View jah existia.');
            }
            // query the index (much faster now!)
            return db.query(nomeIndice, {include_docs: true});
        }).then(function (result) {
            console.log('[' + nomeIndice + '] Resultado consulta index: ', result.rows.length);
            resolve();
        });

    });

}

module.exports = criarView;
