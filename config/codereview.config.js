const config = {

    couchdb: {
        user: "root",
        password: "pass",
        host: "couchdb",
        port: 5984,
        database: "sesol2",
    },

    gitlabHost: "git",

    usuarioComentador: {
        // consulte em
        // $ curl --header "PRIVATE-TOKEN: <TOKEN ADMIN SEM ASPAS>" http://git/api/v4/users?username=<USERNAME DO COMENTADOR>
        // exemplo:
        // $ curl --header "PRIVATE-TOKEN: XXXXXXXXXXXXXXXXXX" http://127.0.0.1:8090/api/v4/users?username=root
        gitlab_userid: 1, // importante para podermos fechar o todos abertos por ele
        token: 'X_zfYU5k2VwDx2KegmdQ' // Token usuario comentador basta ter acesso [api]
    },

    tokenAdmin: 'mKRzDEyu_wsBVd-LCJAt', // Token Admin tem que ter acesso [api, read_user]

    projeto: {
        projectId: 123,
        dataCortePrimeiroCommit: "2017-04-20T18:01:38.000-03:00",
        branchesIgnorados: [
            "nomeDeBranchesQueDevemSerIgnorados"
        ],
    },

    // usuarios abaixo somente serao carregados SOMENTE se nao jah existirem na base; caso jah existam, voce tem que altera-los direto no banco
    committers: [
        {
            username: "alexandrevr",
            sexo: "m",
            aliases: ["alex", "alexandre"],
            quota: 25
        },
        {
            username: "carvalhoj",
            sexo: "m",
            aliases: ["antonio", "antonio.junior"],
            quota: 40
        },
        {
            username: "marcosps",
            sexo: "m",
            aliases: ["marcos", "marcao"],
            quota: 25
        },
        {
            username: "Regiano",
            sexo: "m",
            aliases: ["regis"],
            quota: 10
        },
        {
            username: "fernandesm",
            sexo: "m",
            aliases: ["fernandes", "mauricio", "josemauricio"],
            quota: 0
        },
        {
            username: "LELIAKN",
            sexo: "f",
            aliases: ["lelia", "leliakarina", "leliakn"],
            quota: 0
        },
        {
            username: "CarlaNM",
            sexo: "f",
            aliases: ["carla", "carlanm"],
            quota: 0
        },


        {
            username: "x05499033332",
            sexo: "m",
            aliases: ["afonso"],
            quota: 25
        },
        {
            username: "x05929988846",
            sexo: "m",
            aliases: ["bruno"],
            quota: 25
        },
        {
            username: "x04992831131",
            sexo: "m",
            aliases: ["gabriel", "mesquita"],
            quota: 25
        },
        {
            username: "x05068388213",
            sexo: "f",
            aliases: ["rebeca", "rebecca"],
            quota: 25
        }
    ],

    // quando a ferramenta cadastra um usuario, ela cria um token para poder acessar os dados desse usuario no
    // gitlab. a criacao desse token requer uma msg de justificativa. eh o valor abaixo.
    mensagemTokenCriadoPorCodeReview: "Criado via CodeReview"
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
    config.projeto.projectId = 1;
    config.projeto.dataCortePrimeiroCommit = "2017-04-09T20:59:27.000-03:00";

    config.usuarioComentador.gitlab_userid = 12;
    config.usuarioComentador.token = 'VPmypjV-4QXt_PzKFsxo';
    config.tokenAdmin = 'mKRzDEyu_wsBVd-LCJAt';
}
if (rodandoBackEndViaNodeDiretamenteEmTCU) {
    config.usuarioComentador.token = 'x';
}

module.exports = config;