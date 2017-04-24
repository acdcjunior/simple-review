export abstract class Sesol2 {

    //noinspection JSUnusedGlobalSymbols
    constructor(public _id, public type, toString) {
        if (!_id) {
            throw new Error(`Id eh obrigatório! Type ${type}; _id recebido: ${_id}`);
        }
        Object.defineProperty(this, 'toStringValue', {value: toString, writable: false, enumerable:false});
    }

    toString() {
        return (this as any).toStringValue;
    }

}