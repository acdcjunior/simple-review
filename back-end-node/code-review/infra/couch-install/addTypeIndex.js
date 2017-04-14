
const db = require('../couchdb');

const typeIndex = {
    _id: '_design/type_index',
    views: {
        'type_index': {
            map: function (doc) {
                emit(doc.type);
            }.toString()
        }
    }
};
db.put(typeIndex).then(function () {
    // kick off an initial build, return immediately
    db.query('type_index', {stale: 'update_after'});
    return Promise.resolve(true);
}).catch(function (err) {
    if (err.status === 409) {
        return Promise.resolve(false);
    }
    console.log('Err: ', err);
}).then(function (viewFoiCriada) {
    if (viewFoiCriada) {
        console.log('[type_index] *** View foi criada.');
    } else {
        console.log('[type_index] *** View jah existia.');
    }
    // query the index (much faster now!)
    return db.query('type_index', {key: 'committer', include_docs: true});
}).then(function (result) {
    console.log('[type_index] Commiters via index: ', result.rows.length);
});
