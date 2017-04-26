"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.arquivoProjeto = JSON.parse(fs.readFileSync('../config/projeto.json', 'utf8'));
class ArquivoProjeto {
}
exports.ArquivoProjeto = ArquivoProjeto;
class CommitterConfigStruct {
}
exports.CommitterConfigStruct = CommitterConfigStruct;
