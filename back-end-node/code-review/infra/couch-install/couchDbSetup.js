const corsConfig = require('./corsConfig');
const addTypeIndex = require('./addTypeIndex');
const addCommitsIndexes = require('./addCommitsIndex');

corsConfig().then(() => {
    return addTypeIndex()
}).then(() => {
    addCommitsIndexes();
});