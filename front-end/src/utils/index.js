
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

utils.gitlabLink = (sha) => {
    return `${window.env.GITLAB_PROTOCOL_HOST}/sti/sagas2/commit/${sha}?${utils.diffLadoALado ? 'view=parallel&' : '&'}${utils.ocultarEspacosEmBranco ? 'w=1' : ''}`;
};

utils.atualizarDiff = (sha) => {
    let gitlabLink = utils.gitlabLink(sha);
    try {
        const currentIframeUrl = document.getElementById('diff').contentWindow.location.href;
        if (currentIframeUrl === gitlabLink) {
            return;
        }
    } catch (ignored) { /* cross-domain error, acontece quando estamos no amb de dev. */ }
    document.getElementById('diff').src = gitlabLink;
};

utils.limparDiff = () => {
  document.getElementById('diff').src = ''
}

export default utils
