import * as requestPromise from 'request-promise';

function rest(method, url, token, formData?): Promise<any> {
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

export class Rest {
    public static get<T>(url: string, token: string): Promise<T> {
        return rest("GET", url, token);
    }
    public static post<T>(url: string, token: string, formData?: any): Promise<T> {
        return rest("POST", url, token, formData);
    }
}