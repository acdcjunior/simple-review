"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArrayUtils {
    static arrayShuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    static flatten(arrayDeArrays) {
        return [].concat.apply([], arrayDeArrays);
    }
}
exports.ArrayUtils = ArrayUtils;
