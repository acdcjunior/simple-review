'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var requestPromise = require("request-promise-native");
function rest(method, url, token, formData) {
    var options = {
        url: url,
        headers: {
            'PRIVATE-TOKEN': token
        },
        method: method,
        json: true,
        formData: undefined
    };
    if (method.toUpperCase() === 'POST' && formData !== undefined) {
        options.formData = formData;
    }
    return requestPromise(options);
}
exports.rest = rest;
