const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send('alert("hey2!");');
});

module.exports = router;
