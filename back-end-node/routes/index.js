const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/rsc', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
