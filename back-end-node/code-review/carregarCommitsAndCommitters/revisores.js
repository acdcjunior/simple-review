const revisores = {};

revisores.aliases = {
    'alex@tcu.gov.br': 'alexandrevr@tcu.gov.br',
    'alexandre@tcu.gov.br': 'alexandrevr@tcu.gov.br',

    'antonio@tcu.gov.br': 'antonio.junior@tcu.gov.br',
    'carvalhoj@tcu.gov.br': 'antonio.junior@tcu.gov.br',

    'marcos@tcu.gov.br': 'marcosps@tcu.gov.br',
    'marcao@tcu.gov.br': 'marcosps@tcu.gov.br',

    'regis@tcu.gov.br': 'regiano@tcu.gov.br',

    'fernandes@tcu.gov.br': 'fernandesm@tcu.gov.br',
    'mauricio@tcu.gov.br': 'fernandesm@tcu.gov.br',
    'josemauricio@tcu.gov.br': 'fernandesm@tcu.gov.br',

    'lelia@tcu.gov.br': 'leliakn@tcu.gov.br',
    'leliakarina@tcu.gov.br': 'leliakn@tcu.gov.br',

    'carla@tcu.gov.br': 'carlanm@tcu.gov.br',

    'gabriel@tcu.gov.br': 'x04912831131@tcu.gov.br',
    'mesquita@tcu.gov.br': 'x04912831131@tcu.gov.br',

    'rebeca@tcu.gov.br': 'x05068385107@tcu.gov.br',
    'rebecca@tcu.gov.br': 'x05068385107@tcu.gov.br',

    'afonso@tcu.gov.br': 'x05491194182@tcu.gov.br',

    'bruno@tcu.gov.br': 'x05929991146@tcu.gov.br',
};

revisores.usuarios = {
    'alexandrevr@tcu.gov.br': {nomePorExtenso: 'Alexandre', username: '@lexandrevr'},
    'antonio.junior@tcu.gov.br': {nomePorExtenso: 'Antônio', username: '@carvalhoj'},
    'marcosps@tcu.gov.br': {nomePorExtenso: 'Marcos', username: '@marcosps'},
    'regiano@tcu.gov.br': {nomePorExtenso: 'Regiano', username: '@regiano'},
    'fernandesm@tcu.gov.br': {nomePorExtenso: 'Maurício', username: '@fernandesm'},
    'leliakn@tcu.gov.br': {nomePorExtenso: 'Lélia', username: '@leliakn'},
    'carlanm@tcu.gov.br': {nomePorExtenso: 'Carla', username: '@carlanm'},
    'x04912831131@tcu.gov.br': {nomePorExtenso: 'Gabriel', username: '@x04912831131'},
    'x05068385107@tcu.gov.br': {nomePorExtenso: 'Rebeca', username: '@x05068385107'},
    'x05491194182@tcu.gov.br': {nomePorExtenso: 'Afonso', username: '@x05491194182'},
    'x05929991146@tcu.gov.br': {nomePorExtenso: 'Bruno', username: '@x05929991146'}
};

revisores.emailCanonicoRevisor = function (input) {
    const emailRevisorOuAlias = input + '@tcu.gov.br';

    return revisores.aliases[emailRevisorOuAlias] || emailRevisorOuAlias;
};

revisores.userNameComNome = function (emailCanonico) {
    const usuario = revisores.usuarios(emailCanonico);
    if (!usuario) {
        return emailCanonico;
    }
    return `${usuario.username} (${usuario.nomePorExtenso})`;
};

module.exports = revisores;