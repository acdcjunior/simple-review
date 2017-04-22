import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";
import {Email} from '../geral/Email';
import {RevisoresConfig} from "../codereview/RevisoresConfig";

export class Revisores {

    public static mencaoToEmail(mencao): Promise<Email> {
        if (mencao[0] !== '@') {
            throw new Error(`Mencoes devem comecar com arroba: ${mencao}`);
        }
        return RevisoresConfig.verificados.then(() => {
            let mencaoSemArroba = mencao.substring(1).toLowerCase();
            let username = RevisoresConfig.aliases[mencaoSemArroba] || mencaoSemArroba;
            return GitLabService.getUserByUsername(username).then((user: GitLabUser) => {
                if (!user) {
                    return Promise.resolve(new Email(mencao, true));
                }
                return Promise.resolve(new Email(user.email));
            });
        });
    }

    public static userNameComNome(email: Email): Promise<string> {
        return GitLabService.getUserByEmail(email).then((usuario: GitLabUser) => {
            return Promise.resolve(`@${usuario.username} [${usuario.name}]`);
        });
    }

}