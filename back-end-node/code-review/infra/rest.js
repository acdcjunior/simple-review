'use strict';

let requestPromise = require('request-promise-native');

function rest(method, url, token, formData) {
    let options = {
        url: url,
        headers: {
            'PRIVATE-TOKEN': token
        },
        method: method,
        json: true
    };
    if (method.toUpperCase() === 'POST' && formData !== undefined) {
        options.formData = formData;
    }

    return requestPromise(options);
}

module.exports = rest;