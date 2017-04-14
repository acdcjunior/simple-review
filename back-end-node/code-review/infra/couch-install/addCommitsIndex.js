
const db = require('../couchdb');

const commitIndex = {
    _id: '_design/commits_index',
    views: {
        'commits_index': {
            map: function(doc) {
                if (doc.type === 'commit') {
                    emit(doc.created_at);
                }
            }.toString()
        }
    }
};
db.put(commitIndex).then(function () {
    // kick off an initial build, return immediately
    db.query('commits_index', {stale: 'update_after'});
    return Promise.resolve(true);
}).catch(function (err) {
    if (err.status === 409) {
        return Promise.resolve(false);
    }
    console.log('Err: ', err);
}).then(function (viewFoiCriada) {
    if (viewFoiCriada) {
        console.log('[commits_index] *** View foi criada.');
    } else {
        console.log('[commits_index] *** View jah existia.');
    }
    // query the index (much faster now!)
    return db.query('commits_index', {include_docs: true});
}).then(function (result) {
    console.log('[commits_index] Commits via index: ', result.rows.length);
});
