import PouchDB from 'pouchdb'
import _ from 'lodash'

const db = new PouchDB('sesol2')
const remotedb = new PouchDB('http://localhost:5984/sesol2')

const store = {
  listeners: {},
  todos: {nome: 'Todos', email: 'nao@existe.com'}
}

db.sync(remotedb, {
  live: true,
  retry: true
}).on('change', function (change) {
  console.log('yo, something changed!', change)
  store.callListeners()
}).on('paused', function (info) {
  console.log('replication was paused, usually because of a lost connection', info)
}).on('active', function (info) {
  console.log('replication was resumed:', info)
}).on('error', function (err) {
  console.log('totally unhandled error (shouldn\'t happen):', err)
})

PouchDB.debug.disable()

store.registerListener = (key, funct) => {
  store.listeners[key] = funct
}
store.callListeners = () => {
  Object.keys(store.listeners).forEach(key => {
    store.listeners[key]()
  })
}

store.create = data => {
  return db.post(data)
}

store.findAllOfAllTypes = () => {
  return db.allDocs({include_docs: true})
}

store.findAllOfType = (tipo) => {
  function map (doc, emit) {
    if (doc.type === tipo) {
      emit(doc.createdAt)
    }
  }
  return db.query(map, {include_docs: true}).then(commits =>
    _.map(commits.rows, (commit) => commit.doc)
  )
}

store.findById = (id) => {
  return db.get(id)
}

store.findCommentsByCommitId = (commitId) => {
  function map (doc, emit) {
    if (doc.commitId === commitId) {
      emit(doc.createdAt)
    }
  }
  return db.query(map, {include_docs: true}).then(comments =>
    _.map(comments.rows, (comment) => comment.doc)
  )
}

store.reloadCommits = (obj, prop, exibirSomenteCommitsEfetuadosPor, exibirSomenteCommitsEmQueSouRevisor, meuEmail, exibirSomenteCommitsNaoRevisados) => {
  store.findAllOfType('commit').then(commits => {
    let commitsTrazidos = _.map(commits, (commit) => commit)
    commitsTrazidos = commitsTrazidos.filter(commitTrazido => {
      return (
             (!exibirSomenteCommitsEmQueSouRevisor || commitTrazido.revisor_email === meuEmail) &&
             (exibirSomenteCommitsEfetuadosPor === store.todos.email || commitTrazido.author_email === exibirSomenteCommitsEfetuadosPor) &&
             (!exibirSomenteCommitsNaoRevisados || !commitTrazido.revisado)
      )
    })
    obj[prop] = commitsTrazidos
  })
  if (remotedb) {
    // db.sync(remotedb)
  }
}

store.reloadComments = (obj, prop, commitId) => {
  store.findCommentsByCommitId(commitId).then(comments => {
    obj[prop] = _.map(comments, (comment) => comment)
  })
  if (remotedb) {
    // db.sync(remotedb)
  }
}

export default store
