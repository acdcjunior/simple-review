const config = {

    couchdb: {
        user: "root",
        password: "pass",
        host: "couchdb",
        port: 5984,
        database: "sesol2",
    },

    gitlabHost: "git",
    tokenAdmin: 'yj2--5cKKCSqaDRoND7N', // Token Admin tem que ter acesso [api, read_user]

    projeto: {
        projectId: 123,
        dataCortePrimeiroCommit: "2017-04-20T18:01:38.000-03:00",
        branchesIgnorados: [
            "nomeDeBranchesQueDevemSerIgnorados"
        ],
    },

    botComentador: {
        username: 'sonarqube',
        sexo: "m",
        aliases: [], // aliases nao fazem sentido para o bot, jah q ninguem deve mencionah-lo
        quota: 0 // tem que ser 0, zenao o bot vai ganhar revisoes!
    },

    // usuarios abaixo somente serao carregados SOMENTE se nao jah existirem na base; caso jah existam, voce tem que altera-los direto no banco
    committers: [
        {username: "alexandrevr",  sexo: "m", quota: 25, aliases: ["alex", "alexandre"]},
        {username: "carvalhoj",    sexo: "m", quota: 40, aliases: ["antonio", "antonio.junior"]},
        {username: "marcosps",     sexo: "m", quota: 25, aliases: ["marcos", "marcao"]},
        {username: "Regiano",      sexo: "m", quota: 10, aliases: ["regis"]},
        {username: "fernandesm",   sexo: "m", quota: 0,  aliases: ["fernandes", "mauricio", "josemauricio"]},
        {username: "LELIAKN",      sexo: "f", quota: 0,  aliases: ["lelia", "leliakarina", "leliakn"]},
        {username: "CarlaNM",      sexo: "f", quota: 0,  aliases: ["carla", "carlanm"]},
        {username: "x05499033332", sexo: "m", quota: 25, aliases: ["afonso"]},
        {username: "x05929988846", sexo: "m", quota: 25, aliases: ["bruno"]},
        {username: "x04992831131", sexo: "m", quota: 25, aliases: ["gabriel", "mesquita"]},
        {username: "x05068388213", sexo: "f", quota: 25, aliases: ["rebeca", "rebecca"] }
    ],

    // quando a ferramenta cadastra um usuario, ela cria um token para poder acessar os dados desse usuario no
    // gitlab. a criacao desse token requer uma msg de justificativa. eh o valor abaixo.
    mensagemTokenCriadoPorCodeReview: "Criado via CodeReview",

    trello: {
        key: 'xxx',
        token: 'xxx',
        board_id: 'xx',
        idListEmAndamento: "xx",
        idListEmTestes: "xx"
    }

};

// desenvolvimento em casa
const rodandoBackEndViaNodeDiretamenteEmDellJR = require("os").hostname() === "delljr";
// desenvolvimento no tcu
const rodandoBackEndViaNodeDiretamenteEmTCU = require("os").hostname() === "E-098571";
// backend rodando em docker, mas em casa
let rodandoEmDockerEmDellJR = true;

if (rodandoBackEndViaNodeDiretamenteEmDellJR || rodandoEmDockerEmDellJR) {
    if (rodandoBackEndViaNodeDiretamenteEmDellJR) {
        config.couchdb.host = '192.168.1.195';
        config.gitlabHost = '127.0.0.1:8090';
    }
    config.tokenAdmin = 'zsyEWbKU6ec1sE1HW8ib';

    config.projeto.projectId = 1;
    config.projeto.dataCortePrimeiroCommit = "2017-04-09T20:59:27.000-03:00";

    config.botComentador.username = 'sonarqube';

}
if (rodandoBackEndViaNodeDiretamenteEmTCU) {
    config.botComentador.token = 'x';
}

module.exports = config;