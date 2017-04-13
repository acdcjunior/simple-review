const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send(`
        console.log('inject.js de code review carregado!');
        $(() => {
            // se eh URL de diff
            if (/^\/\w+\/\w+\/commit\/.+$/.test(window.location.pathname)) {
                // remove os headers
                $('body > div.page-with-sidebar > div.content-wrapper.page-with-layout-nav > div.scrolling-tabs-container.sub-nav-scroll').remove();
                $('body > div.page-with-sidebar > div.layout-nav').remove();
                $('body > header').remove();
            }
        });
    `);
});

module.exports = router;
