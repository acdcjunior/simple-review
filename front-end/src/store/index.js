import PouchDB from 'pouchdb';

const DEV_MODE = window.location.host === '127.0.0.1:8080';
function dev() {
    if (DEV_MODE) {
        console.log.apply(this, arguments);
    }
}

const db = new PouchDB('sesol2');
const remotedb = new PouchDB(`http://${window.env.COUCHDB_HOST}:5984/sesol2`);

const store = {
    listeners: {},
    todos: {name: 'Todos', email: 'simplereview@__EVERYONE__'}
};

db.sync(remotedb, {
  live: true,
  retry: true
}).on('change', function (change) {
    dev('SYNC CHANGE: yo, something changed!', change);
    store.callListeners()
}).on('paused', function (info) {
    dev('SYNC PAUSED: replication was paused, (e.g. replication up to date, user went offline) usually because of a lost connection', info);
}).on('active', function (info) {
    dev('SYNC ACTIVE: replication was resumed e.g. new changes replicating, user went back online):', info);
}).on('denied', function (err) {
    dev('SYNC DENIED: a document failed to replicate (e.g. due to permissions):', err)
}).on('complete', function (result) {
    dev('SYNC COMPLETE: complete:', result)
}).on('error', function (err) {
    dev('SYNC ERROR: totally unhandled error (shouldnt happen):', err)
});

if (!DEV_MODE) {
    PouchDB.debug.disable();
}

store.registerListener = (key, funct) => {
    store.listeners[key] = funct
};
store.callListeners = () => {
    Object.keys(store.listeners).forEach(key => {
        store.listeners[key]()
    });
};

store.atualizar = data => {
    return db.post(data)
};

store.create = data => {
    return db.post(data)
};

function queryView(nomeView, keysOpcional) {
    return db.query(nomeView, Object.assign({include_docs: true}, keysOpcional || {})).then(result => {
        return new Promise(resolve => {
            resolve(result.rows.map(row => row.doc));
        })
    });
}
function findAllCommits() {
    return queryView('commits_index');
}

store.findById = (id) => {
    return db.get(id)
};

function commitDoAutor(autorEmail) {
    return commit => commit.author_email === autorEmail;
}
function promiseRetornarSomenteCommitsDoAutor(autor) {
    return commits => Promise.resolve(commits.filter(commitDoAutor(autor)));
}

store.findAllCommitsThat = (emailDoAutor, emailDoRevisor, exibirSomenteCommitsNaoRevisados) => {

    let commitsPromise;
    if (emailDoRevisor === store.todos.email) {
        commitsPromise = findAllCommits();
        if (exibirSomenteCommitsNaoRevisados) {
            commitsPromise = store.findAllCommitsPendentesDeQualquerRevisor();
        }
    } else { // eh de um revisor especifico
        commitsPromise = store.findAllCommitsAtribuidosAoRevisor(emailDoRevisor);
        if (exibirSomenteCommitsNaoRevisados) {
            commitsPromise = store.findAllCommitsPendentesDoRevisor(emailDoRevisor);
        }
    }

    if (emailDoAutor === store.todos.email) {
        return commitsPromise;
    } else {
        return commitsPromise.then(promiseRetornarSomenteCommitsDoAutor(emailDoAutor));
    }
};

store.findAllCommitsPendentesDeQualquerRevisor = () => {
    return queryView('commits_pendendo_revisao_do_revisor', {startkey: ['A'], endkey: ['z', {}]});
};
store.findAllCommitsPendentesDoRevisor = (email) => {
    return queryView('commits_pendendo_revisao_do_revisor', {startkey: [email], endkey: [email, {}]});
};
store.findAllCommitsAtribuidosAoRevisor = (email) => {
    return queryView('commits_atribuidos_para_revisao_do_revisor', {startkey: [email], endkey: [email, {}]});
};

export default store
