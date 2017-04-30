"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestPromise = require("request-promise");
function rest(method, url, token, formData) {
    let options = {
        url: url,
        method: method,
        json: true,
        headers: undefined,
        formData: undefined
    };
    if (token) {
        options.headers = {
            'PRIVATE-TOKEN': token
        };
    }
    if (method.toUpperCase() === 'POST' && formData !== undefined) {
        options.formData = formData;
    }
    return requestPromise(options);
}
class Rest {
    static get(url, token) {
        return rest("GET", url, token);
    }
    static post(url, token, formData) {
        return rest("POST", url, token, formData);
    }
}
exports.Rest = Rest;
