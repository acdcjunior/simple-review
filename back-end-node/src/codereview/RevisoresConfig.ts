import * as fs from "fs";
import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";

const arquivoRevisoresJson = JSON.parse(fs.readFileSync('../config/revisores.json', 'utf8'));

export class RevisoresConfig {

    public static revisores = (() => {
        let revisores = {};
        arquivoRevisoresJson.revisores.forEach(revisor => {
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

    public static revisorPadrao = {
        username: undefined,
        sexo: undefined,
        aliases: [],
        quota: 0
    };

    public static aliases = (() => {
        let aliases = {};
        arquivoRevisoresJson.revisores.forEach(revisor => {
            aliases[revisor.username] = revisor.username;
            if (revisor.aliases) {
                revisor.aliases.forEach(alias => {
                    if (aliases[alias]) {
                        throw new Error(`Alias "${alias}" já está sendo usado por "${aliases[alias]}" e portanto não pode ser adicionado para "${revisor.username}".`);
                    }
                    aliases[alias] = revisor.username;
                })
            }
        });
        return aliases;
    })();

    public static verificados = (() => {
        let promisesVerificacoes = [];
        arquivoRevisoresJson.revisores.forEach(revisor => {
            promisesVerificacoes.push(GitLabService.getUserByUsername(revisor.username).then((gitlabUser: GitLabUser) => {
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

    public static getDadosRevisorConfig(username: string) {
        return RevisoresConfig.revisores[username] || RevisoresConfig.revisorPadrao;
    }

}





