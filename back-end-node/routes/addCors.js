function addCors(req, res) {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = addCors;
