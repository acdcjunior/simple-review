const config = {

    couchdb: {
        user: "root",
        password: "pass",
        host: "couchdb",
        port: 5984,
        database: "sesol2",
    },

    gitlabHost: "git",
    tokenAdmin: '6eG3kEs1rRxynkiCDfD1', // @root user token that must have [api, read_user] access

    projeto: {
        projectId: 1,
        dataCortePrimeiroCommit: "2017-04-20T18:01:38.000-03:00",
        branchesIgnorados: [
            "nomeDeBranchesQueDevemSerIgnorados"
        ],
    },

    botComentador: {
        username: 'simplereview__bot',
        sexo: "m",
        aliases: [], // aliases nao fazem sentido para o bot, jah q ninguem deve mencionah-lo
        quota: 0 // must be 0, otherwise the bot will be assigned reviews!
    },

    // usuarios abaixo somente serao carregados SOMENTE se NAO jah existirem no COUCHDB;
    // caso jah existam, as entradas serao ignoradas e qualquer mudanca (p.ex. quota) terah q ser feita direto no COUCHDB
    committers: [
        {username: "simplereview__joe",   sexo: "m", quota: 10, aliases: ["joe"]},
        {username: "simplereview__alice", sexo: "f", quota: 20, aliases: ["alice", "ali"]},
        {username: "simplereview__bob",   sexo: "m", quota: 10, aliases: ["bob", "bobby"]},
        {username: "simplereview__eve",   sexo: "f", quota: 20, aliases: ["eve"]},
        {username: "simplereview__MaRy",  sexo: "f", quota: 10, aliases: ["ma"]},
        {username: "acdcjunior",          sexo: "m", quota: 20, aliases: ["antonio"]}
    ],

    // quando a ferramenta cadastra um usuario, ela cria um token para poder acessar os dados desse usuario no
    // gitlab. a criacao desse token requer uma msg de justificativa. eh o valor abaixo.
    mensagemTokenCriadoPorCodeReview: "Criado via CodeReview",

    trello: {
        key: 'x',
        token: 'x',
        board_id: 'x',
        idListEmAndamento: "x",
        idListEmTestes: "x"
    }

};

module.exports = config;