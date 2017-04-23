import {sesol2Repository} from "../geral/Sesol2Repository";
import {Commit} from "./Commit";

export class CommitRepository {

    public static findAllCommits(): Promise<Commit[]> {
        return sesol2Repository.findAll<Commit>(Commit.COMMIT_TYPE, Commit.prototype);
    }

}
