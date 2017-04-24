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
    todos: {name: 'Todos', email: 'nao@existe.com'}
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

function commitNaoTemNenhumaRevisaoEfetuadaPor(email) {
    return commit => commit.revisoes.find(revisao => revisao.revisor === email) === undefined;
}
function commitDoAutor(autorEmail) {
    return commit => commit.author_email === autorEmail;
}
function promiseRetornarSomenteCommitsDoAutor(autor) {
    return commits => Promise.resolve(commits.filter(commitDoAutor(autor)));
}
function promiseRetornarSomenteCommitsSemNenhumaRevisaoEfetuadaPor(email) {
    return commits => Promise.resolve(commits.filter(commitNaoTemNenhumaRevisaoEfetuadaPor(email)));
}

/**
 * São 9 possibilidades.
 * 000 last
 * 001 last
 * 010 last
 * 011 first-if
 * 100 last
 * 101 last
 * 110 last
 * 111 first-if
 */
store.findAllCommitsThat = (meuEmail, exibirSomenteCommitsEfetuadosPor, exibirSomenteCommitsEmQueSouRevisor, exibirSomenteCommitsNaoRevisadosPorMim) => {
    if (exibirSomenteCommitsEmQueSouRevisor && exibirSomenteCommitsNaoRevisadosPorMim) {
        if (exibirSomenteCommitsEfetuadosPor === store.todos.email) {
            // 111
            return store.findAllCommitsPendentesDoRevisor(meuEmail);
        } else {
            // 011
            return store.findAllCommitsPendentesDoRevisor(meuEmail).then(promiseRetornarSomenteCommitsDoAutor(exibirSomenteCommitsEfetuadosPor));
        }
    }
    let commitsPromise;
    if (exibirSomenteCommitsEmQueSouRevisor) {
        // x1x
        commitsPromise = store.findAllCommitsAtribuidosAoRevisor(meuEmail);
    } else {
        // x0x
        commitsPromise = findAllCommits();
    }

    if (exibirSomenteCommitsNaoRevisadosPorMim) {
        // xx1
        // x11
        // x01
        commitsPromise = commitsPromise.then(promiseRetornarSomenteCommitsSemNenhumaRevisaoEfetuadaPor(meuEmail));
    } else {
        // xx0
        // x10
        // x00
        // commitsPromise = commitsPromise;
    }

    if (exibirSomenteCommitsEfetuadosPor === store.todos.email) {
        // 1xx
        // 111
        // 101
        // 110
        // 100
        return commitsPromise;
    } else {
        // 0xx
        // 011
        // 001
        // 010
        // 000
        return commitsPromise.then(promiseRetornarSomenteCommitsDoAutor(exibirSomenteCommitsEfetuadosPor));
    }
};

store.findAllCommitsPendentesDoRevisor = (email) => {
    return queryView('commits_pendendo_revisao_do_revisor', {startkey: [email], endkey: [email, {}]});
};
store.findAllCommitsAtribuidosAoRevisor = (email) => {
    return queryView('commits_atribuidos_para_revisao_do_revisor', {startkey: [email], endkey: [email, {}]});
};

export default store
