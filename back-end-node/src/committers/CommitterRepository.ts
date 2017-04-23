import {sesol2Repository} from "../domain/Sesol2Repository";
import {Committer} from "../domain/Committer";

export class CommitterRepository {

    static findCommittersByUsernameOrAlias(usernameOrAlias: string): Promise<Committer[]> {
        return sesol2Repository.queryView<Committer>('committers_aliases_index', usernameOrAlias);
    }

    static findAllCommitters(): Promise<Committer[]> {
        return sesol2Repository.findAll(Committer.COMMITTER_TYPE)
    }

}