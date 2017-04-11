'use strict';

let requestPromise = require('request-promise-native');

function rest(method, url, token) {
    let options = {
        url: url,
        headers: {
            'PRIVATE-TOKEN': token
        },
        method: method,
        json: true
    };

    return requestPromise(options);
}

module.exports = rest;