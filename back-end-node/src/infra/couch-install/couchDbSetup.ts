import {corsConfig} from './corsConfig';
import {addTypeIndex} from './addTypeIndex';
import {addCommitsIndexes} from './addCommitsIndexes';
import {addCommittersAliasesIndex} from "./addCommittersAliasesIndex";

corsConfig()
    .then(() => addTypeIndex())
    .then(() => addCommitsIndexes())
    .then(() => addCommittersAliasesIndex())
    .then(() => console.log(`
    
    Configuracao CouchDB concluida.
    -----------------------------------------------------------
`));