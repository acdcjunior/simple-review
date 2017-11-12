const express = require('express');
const path = require('path');

const app = express();
const router = express.Router();

// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(`/code-review`, express.static(path.join(__dirname, 'dist')));
app.use(`/static`, express.static(path.join(__dirname, 'dist', 'static')));
app.use(`/code-review/vendor`, express.static(path.join(__dirname, 'vendor')));

console.log(`Servidor executando na porta 5000!`);
app.listen(5000);