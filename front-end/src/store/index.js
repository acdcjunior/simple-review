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
    dev('yo, something changed!', change);
    store.callListeners()
}).on('paused', function (info) {
    dev('replication was paused, usually because of a lost connection', info);
}).on('active', function (info) {
    dev('replication was resumed:', info);
}).on('error', function (err) {
    dev('totally unhandled error (shouldn\'t happen):', err)
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

store.create = data => {
    return db.post(data)
};

function queryView(nomeView) {
    return db.query(nomeView, {include_docs: true}).then(result => {
        return new Promise(resolve => {
            resolve(result.rows.map(row => row.doc));
        })
    });
}
function findAllCommits() {
    return queryView('commits_index');
}
function findAllCommitsRevisadosNao() {
    return queryView('commits_revisados_nao_index');
}

store.findById = (id) => {
    return db.get(id)
};

store.reloadCommits = (obj, prop, exibirSomenteCommitsEfetuadosPor, exibirSomenteCommitsEmQueSouRevisor, meuEmail, exibirSomenteCommitsNaoRevisados) => {
    let commitsPromise;
    if (exibirSomenteCommitsNaoRevisados) {
        commitsPromise = findAllCommitsRevisadosNao();
    } else {
        commitsPromise = findAllCommits();
    }
    commitsPromise.then(commits => {
        obj[prop] = commits.filter(commitTrazido => {
            return (
                (!exibirSomenteCommitsEmQueSouRevisor || commitTrazido.revisores.indexOf(meuEmail) !== -1) &&
                (exibirSomenteCommitsEfetuadosPor === store.todos.email || commitTrazido.author_email === exibirSomenteCommitsEfetuadosPor)
            )
        });
    })
};

export default store
