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
class Rest {
    static get(url, token) {
        return rest("GET", url, token);
    }
    static post(url, token, formData) {
        return rest("POST", url, token, formData);
    }
}
exports.Rest = Rest;
