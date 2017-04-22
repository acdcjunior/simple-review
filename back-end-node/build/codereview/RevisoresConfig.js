"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const GitLabService_1 = require("../gitlab/GitLabService");
const revisoresJson = JSON.parse(fs.readFileSync('../config/revisores.json', 'utf8'));
class RevisoresConfig {
    static getDadosRevisorConfig(username) {
        return RevisoresConfig.revisores[username] || RevisoresConfig.revisorPadrao;
    }
}
RevisoresConfig.revisores = (() => {
    let revisores = {};
    revisoresJson.revisores.forEach(revisor => {
        if (!revisor.username) {
            throw new Error(`Revisor cadastrado sem username! ${revisor}`);
        }
        if (revisor.sexo !== "m" && revisor.sexo !== "f") {
            throw new Error(`Sexo do revisor ${revisor.username} não é "m" ou "f". Foi setado como "${revisor.sexo}".`);
        }
        if (typeof revisor.quota !== "number") {
            throw new Error(`Quota do revisor ${revisor.username} deve ser um número.`);
        }
        revisor.vazioOuA = () => revisor.sexo === "m" ? "" : "a";
        revisor.oOuA = () => revisor.sexo === "m" ? "o" : "a";
        revisores[revisor.username] = revisor;
    });
    console.log(`RevisoresConfig: revisores.json carregados.`);
    return revisores;
})();
RevisoresConfig.revisorPadrao = {
    username: undefined,
    sexo: undefined,
    aliases: [],
    quota: 0
};
RevisoresConfig.aliases = (() => {
    let aliases = {};
    revisoresJson.revisores.forEach(revisor => {
        if (revisor.aliases) {
            revisor.aliases.forEach(alias => {
                if (aliases[alias]) {
                    throw new Error(`Alias "${alias}" já está sendo usado por "${aliases[alias]}" e portanto não pode ser adicionado para "${revisor.username}".`);
                }
                aliases[alias] = revisor.username;
            });
        }
    });
    return aliases;
})();
RevisoresConfig.verificados = (() => {
    let promisesVerificacoes = [];
    revisoresJson.revisores.forEach(revisor => {
        promisesVerificacoes.push(GitLabService_1.GitLabService.getUserByUsername(revisor.username).then((gitlabUser) => {
            if (!gitlabUser) {
                throw new Error(`Revisor de username ${revisor.username} não foi encontrado no GitLab!`);
            }
            RevisoresConfig.revisores[gitlabUser.email] = revisor;
            return Promise.resolve();
        }));
    });
    return Promise.all(promisesVerificacoes).then(() => {
        console.log(`RevisoresConfig: revisores.json validados.`);
        return Promise.resolve();
    });
})();
exports.RevisoresConfig = RevisoresConfig;
