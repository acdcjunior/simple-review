class Sesol2 {

    constructor(_id, type, toString) {
        this._id = _id;
        this.type = type;
        Object.defineProperty(this, 'toStringValue', {value: toString, writable: false, enumerable:false});
    }

    toString() {
        return this.toStringValue;
    }

}

module.exports = Sesol2;