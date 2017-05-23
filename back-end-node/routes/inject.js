const express = require('express');
const router = express.Router();

function inject() {
    const DIFF_URL_AFTER_SIGN_IN = 'diffUrlAfterSignIn';

    // se acessou o servidor sem contexto
    if (window === window.top) {
        if (window.location.pathname === '/') {
            window.location.href = '/code-review/';
            return;
        }
        if (window.location.pathname === '/users/sign_in') {
            localStorage.setItem(DIFF_URL_AFTER_SIGN_IN, '/code-review/');
            return;
        }
    }
    if (document.title === "The page you're looking for could not be found (404)") {
        localStorage.setItem(DIFF_URL_AFTER_SIGN_IN, window.location.href);
        window.location.href = '/users/sign_in';
        return;
    }
    if (window.location.pathname === '/' && localStorage.getItem(DIFF_URL_AFTER_SIGN_IN)) {
        const diffUrlAfterSignIn = localStorage.getItem(DIFF_URL_AFTER_SIGN_IN);
        localStorage.removeItem(DIFF_URL_AFTER_SIGN_IN);
        window.location.href = diffUrlAfterSignIn;
        return;
    }
    $(() => {
        // se eh URL de diff
        if (/^\/\w+\/\w+\/commit\/.+$/.test(window.location.pathname)) {
            // remove os headers
            $('body > div.page-with-sidebar > div.content-wrapper.page-with-layout-nav > div.scrolling-tabs-container.sub-nav-scroll').remove();
            $('body > div.page-with-sidebar > div.layout-nav').remove();
            $('body > header').remove();

            // remove a limitacao da width no diff
            $(".container-limited").css("max-width", "none")
        }
    });
}

router.get('/', function (req, res) {
    res.send(`
        console.log('inject.js de code review carregado!');
        \n(${inject.toString()})();
    `);
});

module.exports = router;
