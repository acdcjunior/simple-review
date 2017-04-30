// executar isso num console com jQuery

function criarUser(nome, username, email) {
    console.log('Criando username: ', username);
    let usuario = {
        email: email || username + "@tcu.gov.br",
        username: username,
        name: nome,
        reset_password: true
    };
    $.ajax({
        url: 'http://127.0.0.1:8090/api/v4/users',
        type: 'post',
        data: usuario,
        headers: {
            "PRIVATE-TOKEN": 'zsyEWbKU6ec1sE1HW8ib'
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
criarUser("Antonio C. de Carvalho Junior (CARVALHOJ)", "carvalhoj", "antonio.junior@tcu.gov.br");
criarUser("Carla Nassif Nassif Cortez Marcomini (CARLANM)", "CarlaNM");
criarUser("Jose Mauricio Fernandes (FERNANDESM)", "fernandesm");
criarUser("Lelia Karina Nunes (LELIAKN)", "LELIAKN");
criarUser("Marcos Paulo Pereira da Silva (MARCOSPS)", "marcosps");
criarUser("Regiano da Silva Alves (REGIANO)", "Regiano");

criarUser("SonarQube GitLab", "sonarqube", "acdcjunior@gmail.com");
