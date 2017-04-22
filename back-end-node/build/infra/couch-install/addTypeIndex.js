"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const criarView_1 = require("./criarView");
function addTypeIndex() {
    return criarView_1.criarView('type_index', function (doc) {
        emit(doc.type);
    });
}
exports.addTypeIndex = addTypeIndex;
