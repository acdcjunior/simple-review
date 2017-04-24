# vue-pouch-example

Vue.js + PouchDB

## Build Setup

``` bash
# install dependencies
npm install

# install PouchDB Server

npm install -g pouchdb-server

# serve PouchDB at localhost:5984
pouchdb-server --port 5984

# serve app with hot reload at localhost:8080
npm run dev
```


---

Para desenvolver:

    # Front-End:
    # Suba o servidor de front end na porta 5000
    npm run servir
    # Suba o front-end dev:
    npm run dev
    # back-end:
    npm start
    
    
-----------

Subindo o docker-compose:

- Cria um CouchDB, com volume de dados conforme especificado no yaml
- Cria um Fauxton apontando para o CouhDB