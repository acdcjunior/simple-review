const imgInterrogacao = require('../assets/question_mark.png');

const committers = {
  commiterLogado: undefined,
  committers: {
    'nada@erro.com': {email: 'nada@erro.com', name: 'Erro ao obter committers.', avatar_url: imgInterrogacao}
  }
};

window.$.ajax({
  dataType: 'json',
  url: `${window.env.BACK_END_NODE}/back-end-review/committers`,
  async: false,
  timeout: 3000, // sets timeout to 3 seconds
  success: receivedCommitters => {
    committers.committers = {};
    receivedCommitters.forEach(receivedCommitter => {
      committers.committers[receivedCommitter.email] = receivedCommitter
    })
  },
  error: (err) => {
    console.error(err);
    alert('Servico de committers estah fora!!');
  }
});

committers.get = (email) => {
  if (committers.committers[email]) {
    return committers.committers[email]
  }
  return {email: email, name: email, avatar_url: imgInterrogacao}
};

committers.testLogin = (component) => {
  if (!committers.commiterLogado) {
    let cookieLogado = component.$cookie.get('commiterLogado');
    if (cookieLogado) {
      committers.commiterLogado = committers.committers[JSON.parse(cookieLogado).email]
    } else {
      component.$router.go('/login');
      return true
    }
  }
};

export default committers
