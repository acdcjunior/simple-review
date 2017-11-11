const imgInterrogacao = require('../assets/question_mark.png');
import {CommitterEntity} from "../servicos/CommitterService";

const committers = {
  committerLogado: undefined,
  committers: {
    'nada@erro.com': {email: 'nada@erro.com', username: 'erro', name: 'Erro ao obter committers.', sexo: "m", avatar_url: imgInterrogacao}
  },
  botComentador: [],
  committerEntity: function (email) {
      return new CommitterEntity(committers.committers[email]);
  }
};

window.$.ajax({
  dataType: 'json',
  url: `${window.env.BACK_END_NODE}/committers`,
  async: false,
  timeout: 3000, // sets timeout to 3 seconds
  success: receivedCommitters => {
    committers.committers = {};
    receivedCommitters.forEach(receivedCommitter => {
      if (receivedCommitter.isBotComentador) {
        committers.botComentador = receivedCommitter;
      }
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
  return {email: email, username: (email || 'sem-email').replace(/@.*/g, ''), name: email, avatar_url: imgInterrogacao}
};

committers.testLogin = (component) => {
  if (!committers.committerLogado) {
    let cookieLogado = component.$cookie.get('committerLogado');
    if (cookieLogado) {
      committers.committerLogado = committers.committerEntity(JSON.parse(cookieLogado).email)
    } else {
      component.$router.go('/login');
      return true
    }
  }
};

export default committers
