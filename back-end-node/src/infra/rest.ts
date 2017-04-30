import * as requestPromise from 'request-promise';

function rest(method, url, token?, formData?): Promise<any> {
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

export class Rest {
    public static get<T>(url: string, token?: string): Promise<T> {
        return rest("GET", url, token);
    }
    public static post<T>(url: string, token: string, formData?: any): Promise<T> {
        return rest("POST", url, token, formData);
    }
}