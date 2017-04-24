// executar isso num console com jQuery

function criarUser(nome, username) {
    console.log('Criando username: ', username);
    let usuario = {
        email: username + "@tcu.gov.br",
        username: username,
        name: nome,
        reset_password: true
    };
    $.ajax({
        url: 'http://127.0.0.1:8090/api/v4/users',
        type: 'post',
        data: usuario,
        headers: {
            "PRIVATE-TOKEN": 'M3_6_x-z3HQEPc4Z4TYg'
        },
        dataType: 'json',
        success: function (data) {
            console.info('Sucesso ao criar '+username+': ', data);
        }
    });
}

criarUser("Afonso Dias de Oliveira Conceição Silva (X05491194182)", "x05491194182");
criarUser("Bruno Kywan Vasconcelos Gois (X05929991146)", "x05929991146");
criarUser("Gabriel Mesquita de Araujo (X04912831131)", "x04912831131");
criarUser("Rebeca Andrade Baldomir (X05068385107)", "x05068385107");

criarUser("Alexandre Vaz Roriz (ALEXANDREVR)", "alexandrevr");
criarUser("Antonio C. de Carvalho Junior (CARVALHOJ)", "antonio.junior");
criarUser("Carla Nassif Nassif Cortez Marcomini (CARLANM)", "carlanm");
criarUser("Jose Mauricio Fernandes (FERNANDESM)", "fernandesm");
criarUser("Lelia Karina Nunes (LELIAKN)", "leliakn");
criarUser("Marcos Paulo Pereira da Silva (MARCOSPS)", "marcosps");
criarUser("Regiano da Silva Alves (REGIANO)", "regiano");