'use strict';

import * as requestPromise from 'request-promise-native';

export function rest(method, url, token, formData?): Promise<any> {
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