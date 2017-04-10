var privateToken = 'M3_6_x-z3HQEPc4Z4TYg';
function criarUser(nome, username) {
    console.log('Criando username: ', username);
    var usuario = {
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
            "PRIVATE-TOKEN": privateToken
        },
        dataType: 'json',
        success: function (data) {
            console.info('Sucesso ao criar '+username+': ', data);
        }
    });
}

criarUser("Afonso Dias de Oliveira Barros (X11111111111)", "x11111111111");
criarUser("Bruno Kwian Oliveira Silva (X22222222222)", "x22222222222");
criarUser("Gabriel Mesquita de Araujo (X04912831131)", "x04912831131");
criarUser("Rebeca Andrade Baldomir (X05068385107)", "x05068385107");

criarUser("Alexandre Vaz Roriz (ALEXANDREVR)", "alexandrevr");
criarUser("Antonio C. de Carvalho Junior (CARVALHOJ)", "antonio.junior");
criarUser("Carla Nassif Sobrenome (CARLANS)", "carlans");
criarUser("Jose Mauricio Fernandes (FERNANDESM)", "fernandesm");
criarUser("Lelia Karina Nunes (LELIAKN)", "leliakn");
criarUser("Marcos Paulo Pereira da Silva (MARCOSPS)", "marcosps");
criarUser("Regiano da Silva Alves (REGIANO)", "regiano");