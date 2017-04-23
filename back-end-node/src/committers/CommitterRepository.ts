import {sesol2Repository} from "../domain/Sesol2Repository";
import {Committer} from "./Committer";

export class CommitterRepository {

    static findCommittersByUsernameOrAlias(usernameOrAlias: string): Promise<Committer> {
        return sesol2Repository.queryView<Committer>('committers_aliases_index', usernameOrAlias).then((committers: Committer[]) => {
            if (committers.length === 0) {
                return Promise.resolve(Committer.committerInvalido(usernameOrAlias));
            }
            return Promise.resolve(committers[0]);
        });
    }

    static findAllCommitters(): Promise<Committer[]> {
        return sesol2Repository.findAll(Committer.COMMITTER_TYPE)
    }

}