"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsConfig_1 = require("./corsConfig");
const addTypeIndex_1 = require("./addTypeIndex");
const addCommitsIndexes_1 = require("./addCommitsIndexes");
corsConfig_1.corsConfig().then(() => {
    return addTypeIndex_1.addTypeIndex();
}).then(() => {
    addCommitsIndexes_1.addCommitsIndexes();
});
