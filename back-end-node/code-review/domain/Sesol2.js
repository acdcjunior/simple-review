"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sesol2 {
    constructor(_id, type, toString) {
        this._id = _id;
        this.type = type;
        Object.defineProperty(this, 'toStringValue', { value: toString, writable: false, enumerable: false });
    }
    toString() {
        return this.toStringValue;
    }
}
exports.Sesol2 = Sesol2;
