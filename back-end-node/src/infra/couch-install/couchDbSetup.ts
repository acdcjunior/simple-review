import {corsConfig} from './corsConfig';
import {addTypeIndex} from './addTypeIndex';
import {addCommitsIndexes} from './addCommitsIndexes';
import {addCommittersAliasesIndex} from "./addCommittersAliasesIndex";

corsConfig().then(() => {
    return addTypeIndex()
}).then(() => {
    return addCommitsIndexes();
}).then(() => {
    return addCommittersAliasesIndex();
});