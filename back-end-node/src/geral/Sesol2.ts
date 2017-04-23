export abstract class Sesol2 {

    //noinspection JSUnusedGlobalSymbols
    constructor(public _id, public type, toString) {
        Object.defineProperty(this, 'toStringValue', {value: toString, writable: false, enumerable:false});
    }

    toString() {
        return (this as any).toStringValue;
    }

}