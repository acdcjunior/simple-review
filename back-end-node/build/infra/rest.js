"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestPromise = require("request-promise");
function rest(method, url, token, formData) {
    let options = {
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
class Rest {
    static get(url, token) {
        return rest("get", url, token);
    }
    static post(url, token, formData) {
        return rest("post", url, token, formData);
    }
}
exports.Rest = Rest;
