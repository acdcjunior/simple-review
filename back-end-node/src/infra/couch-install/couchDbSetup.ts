import {corsConfig} from './corsConfig';
import {addTypeIndex} from './addTypeIndex';
import {addCommitsIndexes} from './addCommitsIndexes';

corsConfig().then(() => {
    return addTypeIndex()
}).then(() => {
    addCommitsIndexes();
});