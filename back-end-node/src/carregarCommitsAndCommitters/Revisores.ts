import {GitLabService} from "../gitlab/GitLabService";
import {GitLabUser} from "../gitlab/GitLabUser";
import {Email} from '../geral/Email';

export class Revisores {

    private static aliases = {
        'alex@tcu.gov.br': 'alexandrevr@tcu.gov.br',
        'alexandre@tcu.gov.br': 'alexandrevr@tcu.gov.br',

        'antonio@tcu.gov.br': 'antonio.junior@tcu.gov.br',
        'carvalhoj@tcu.gov.br': 'antonio.junior@tcu.gov.br',

        'marcos@tcu.gov.br': 'marcosps@tcu.gov.br',
        'marcao@tcu.gov.br': 'marcosps@tcu.gov.br',

        'regis@tcu.gov.br': 'regiano@tcu.gov.br',

        'fernandes@tcu.gov.br': 'fernandesm@tcu.gov.br',
        'mauricio@tcu.gov.br': 'fernandesm@tcu.gov.br',
        'josemauricio@tcu.gov.br': 'fernandesm@tcu.gov.br',

        'lelia@tcu.gov.br': 'leliakn@tcu.gov.br',
        'leliakarina@tcu.gov.br': 'leliakn@tcu.gov.br',

        'carla@tcu.gov.br': 'carlanm@tcu.gov.br',

        'gabriel@tcu.gov.br': 'x04912831131@tcu.gov.br',
        'mesquita@tcu.gov.br': 'x04912831131@tcu.gov.br',

        'rebeca@tcu.gov.br': 'x05068385107@tcu.gov.br',
        'rebecca@tcu.gov.br': 'x05068385107@tcu.gov.br',

        'afonso@tcu.gov.br': 'x05491194182@tcu.gov.br',

        'bruno@tcu.gov.br': 'x05929991146@tcu.gov.br',
    };

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
        let mencaoSemArroba = mencao;
        if (mencao[0] === '@') {
            mencaoSemArroba = mencao.substring(1);
        }
        mencaoSemArroba = mencaoSemArroba.toLowerCase();
        let username = Revisores.usernamesAliases[mencaoSemArroba] || mencaoSemArroba;
        return GitLabService.getUserByUsername(username).then((user: GitLabUser) => {
            if (!user) {
                return Promise.resolve(undefined as Email);
            }
            return Promise.resolve(new Email(user.email));
        });
    }

    public static emailCanonicoRevisor(input): string {
        const emailRevisorOuAlias = input + (input.endsWith('@tcu.gov.br') ? '' : '@tcu.gov.br');

        return Revisores.aliases[emailRevisorOuAlias] || emailRevisorOuAlias;
    }

    public static userNameComNome(emailCanonico): Promise<string> {
        const emailCanonicoRevisor = Revisores.emailCanonicoRevisor(emailCanonico);
        return GitLabService.getUser(emailCanonicoRevisor).then(usuario => {
            return Promise.resolve(`@${usuario.username} [${usuario.name}]`);
        });
    }

}