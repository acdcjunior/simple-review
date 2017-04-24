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

app.use(`/code-review`, express.static(path.join(__dirname, 'dist')));
app.use(`/static`, express.static(path.join(__dirname, 'dist', 'static')));
app.use(`/code-review/vendor`, express.static(path.join(__dirname, 'vendor')));

console.log(`Servidor executando na porta 5000!`);
app.listen(5000);