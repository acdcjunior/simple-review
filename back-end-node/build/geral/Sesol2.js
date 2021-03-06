"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sesol2 {
    //noinspection JSUnusedGlobalSymbols
    constructor(_id, type, toString) {
        this._id = _id;
        this.type = type;
        if (!_id) {
            throw new Error(`Id eh obrigatório! Type ${type}; _id recebido: ${_id}`);
        }
        Object.defineProperty(this, 'toStringValue', { value: toString, writable: false, enumerable: false });
    }
    toString() {
        return this.toStringValue;
    }
}
exports.Sesol2 = Sesol2;
