const corsConfig = require('./corsConfig');
const addTypeIndex = require('./addTypeIndex');
const addCommitsIndexes = require('./addCommitsIndexes');

corsConfig().then(() => {
    return addTypeIndex()
}).then(() => {
    addCommitsIndexes();
});