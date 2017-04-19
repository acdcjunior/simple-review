const GitLab = require('./GitLab').GitLab;

const user = GitLab.getUser('antonio.junior');
user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));