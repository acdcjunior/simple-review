
const utils = {}

let capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
utils.timeago = (dateAsString) => {
  let dataPassada = Date.parse(dateAsString)
  if (((+Date.now()) - (+dataPassada)) < 15 * 1000) {
    return 'agora mesmo'
  }
  return window.jQuery.timeago(dataPassada)
}
utils.timeagoMaiusculo = (dateAsString) => {
  return capitalizeFirstLetter(utils.timeago(dateAsString))
}

utils.ocultarEspacosEmBranco = true;
utils.diffLadoALado = true;

const gitlabHost = window.location.host.indexOf('127.0.0.1') === -1 ? '127.0.0.1:8090' : 'git';
utils.gitlabLink = (sha) => {
    return `http://${gitlabHost}/sti/sagas2/commit/${sha}?${utils.diffLadoALado ? 'view=parallel&' : '&'}${utils.ocultarEspacosEmBranco ? 'w=1' : ''}`;
};
utils.gitlabLoginLink = () => {
    return `http://${gitlabHost}/users/sign_in`;
};
utils.atualizarDiff = (sha) => {
  let gitlabLink = utils.gitlabLink(sha)
  if (document.getElementById('diff').src !== gitlabLink) {
    document.getElementById('diff').src = gitlabLink
  }
}
utils.limparDiff = () => {
  document.getElementById('diff').src = ''
}

export default utils
