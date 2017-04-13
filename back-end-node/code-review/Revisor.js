class Revisor {

    static revisorIndicado(sha, revisorIndicado) {
        return `Revisor ${revisorIndicado} atribuído por indicação via mensagem de commit.`;
    }

    static revisorCalculado(sha, revisorCalculado) {
        return `Revisor ${revisorCalculado} atribuído automaticamente pelo sistema.`;
    }

}

module.exports = Revisor;