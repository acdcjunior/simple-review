import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";
import {Email} from '../geral/Email';




export class Revisores {

    private static usernamesAliases = {
        'alex': 'alexandrevr',
        'alexandre': 'alexandrevr',

        'antonio': 'carvalhoj',
        'antonio.junior': 'carvalhoj',

        'marcos': 'marcosps',
        'marcao': 'marcosps',

        'regis': 'regiano',

        'fernandes': 'fernandesm',
        'mauricio': 'fernandesm',
        'josemauricio': 'fernandesm',

        'lelia': 'LELIAKN',
        'leliakarina': 'LELIAKN',
        'leliakn': 'LELIAKN',

        'carla': 'CarlaNM',
        'carlanm': 'CarlaNM',

        'gabriel': 'x04912831131',
        'mesquita': 'x04912831131',

        'rebeca': 'x05068385107',
        'rebecca': 'x05068385107',

        'afonso': 'x05491194182',

        'bruno': 'x05929991146',
    };

    public static mencaoToEmail(mencao): Promise<Email> {
        if (mencao[0] !== '@') {
            throw new Error(`Mencoes devem comecar com arroba: ${mencao}`);
        }
        let mencaoSemArroba = mencao.substring(1).toLowerCase();
        let username = Revisores.usernamesAliases[mencaoSemArroba] || mencaoSemArroba;
        return GitLabService.getUserByUsername(username).then((user: GitLabUser) => {
            if (!user) {
                return Promise.resolve(new Email(mencao, true));
            }
            return Promise.resolve(new Email(user.email));
        });
    }

    public static userNameComNome(email: Email): Promise<string> {
        return GitLabService.getUserByEmail(email).then((usuario: GitLabUser) => {
            return Promise.resolve(`@${usuario.username} [${usuario.name}]`);
        });
    }

}