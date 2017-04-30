import {sesol2Repository} from "../geral/Sesol2Repository";
import {Committer} from "./Committer";
import {codeReviewConfig} from "../geral/CodeReviewConfig";

export class CommitterRepository {

    static findBotComentador(): Promise<Committer> {
        return CommitterRepository.findCommitterByUsernameOrAlias(codeReviewConfig.botComentador.username);
    }

    static findCommitterByUsernameOrAlias(usernameOrAlias: string): Promise<Committer> {
        return sesol2Repository.queryView<Committer>('committers_aliases_index', Committer.prototype, usernameOrAlias).then((committers: Committer[]) => {
            if (committers.length === 0) {
                return Committer.committerInvalido(usernameOrAlias);
            }
            return committers[0];
        });
    }

    static findAllCommitters(): Promise<Committer[]> {
        return sesol2Repository.findAll<Committer>(Committer.COMMITTER_TYPE, Committer.prototype)
    }

}