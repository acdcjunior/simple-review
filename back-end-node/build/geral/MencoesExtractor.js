"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommitterRepository_1 = require("../committers/CommitterRepository");
class MencoesExtractor {
    static extrairCommittersMencionadosNaMensagemDoCommit(commitSemRevisor) {
        return MencoesExtractor.extrairCommittersMencionadosNoTexto(commitSemRevisor.message);
    }
    static extrairCommittersMencionadosNoTexto(texto) {
        const mencoes = texto.match(/@[a-zA-Z.0-9]+/g) || [];
        return Promise.all(mencoes
            .map(mencaoComArroba => mencaoComArroba.substring(1))
            .map(mencaoSemArroba => mencaoSemArroba.toLowerCase())
            .map(CommitterRepository_1.CommitterRepository.findCommitterByUsernameOrAlias));
    }
}
exports.MencoesExtractor = MencoesExtractor;
