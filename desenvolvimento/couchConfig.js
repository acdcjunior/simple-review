function couchConfig(resource, value) {
    $.ajax({
        url: 'http://root:pass@localhost:5984/_config/' + resource,
        type: 'PUT',
        data: value,
        headers: { "Authorization": "Basic cm9vdDpwYXNz" },
        dataType: 'json',
        success: (x, y, z) => console.info(resource + ' success: ', x, y, z),
        error: (x, y, z) => console.info(resource + ' error: ', x, y, z),
        complete: (x, y, z) => console.info(resource + ' complete: ', x, y, z)
    });
}
couchConfig('httpd/enable_cors', '"true"');
couchConfig('cors/origins', '"*"');
couchConfig('cors/credentials', '"true"');
couchConfig('cors/methods', '"GET, PUT, POST, HEAD, DELETE"');
couchConfig('cors/headers', '"accept, authorization, content-type, origin, referer, x-csrf-token"');
