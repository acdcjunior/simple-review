const express = require('express');
const router = express.Router();

function inject() {
    console.log('simple-review executed at gitlab frame!');

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
        const isCommitDiffPage = /^\/[-\w]+\/[-\w]+\/commit\/.+$/.test(window.location.pathname);
        const isTODOsPage = /\/dashboard\/todos/.test(window.location.pathname);
        if (isCommitDiffPage || isTODOsPage) {
            // remove the headers
            $('body > div.page-with-sidebar > div.content-wrapper.page-with-layout-nav > div.scrolling-tabs-container.sub-nav-scroll').remove();
            $('body > div.page-with-sidebar > div.layout-nav').remove();
            $('body > header').remove();
            $('body > .nav-sidebar-inner-scroll').remove();

            // remove new sidebar
            $('body .nav-sidebar').remove();
            $('body .page-with-new-sidebar').removeClass('page-with-new-sidebar');

            // remove new nav
            $('body .page-with-new-nav .alert-wrapper').remove();
            $('body .page-with-new-nav').removeClass('page-with-new-nav');

            // remove width limitation of diff
            $(".container-limited").css("max-width", "none")
        }
        parent.window.postMessage('hide-loading', '*');
    });
}

router.get('/', function (req, res) {
    res.send(`
        console.log('simple-review injected into gitlab frame!');
        \nwindow.addEventListener('load', \n${inject.toString()}, false);
    `);
});

module.exports = router;
