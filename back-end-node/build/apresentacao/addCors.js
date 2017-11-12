"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// noinspection JSUnusedLocalSymbols
function addCors(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
}
exports.addCors = addCors;
