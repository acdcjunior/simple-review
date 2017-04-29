import {sesol2Repository} from "../geral/Sesol2Repository";
import {Committer} from "./Committer";

export class CommitterRepository {

    static findCommitterByUsernameOrAlias(usernameOrAlias: string): Promise<Committer> {
        return sesol2Repository.queryView<Committer>('committers_aliases_index', Committer.prototype, usernameOrAlias).then((committers: Committer[]) => {
            if (committers.length === 0) {
                return Promise.resolve(Committer.committerInvalido(usernameOrAlias));
            }
            return Promise.resolve(committers[0]);
        });
    }

    static findAllCommitters(): Promise<Committer[]> {
        return sesol2Repository.findAll<Committer>(Committer.COMMITTER_TYPE, Committer.prototype)
    }

}