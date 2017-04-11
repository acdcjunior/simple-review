const Sesol2 = require('./Sesol2');
const sesol2Repository = require('./Sesol2Repository');

const COMMITTER_TYPE = 'committer';
class Committer extends Sesol2
{

    constructor(email, name, avatar_url)
    {
        super(Committer.corrigirEmail(email), COMMITTER_TYPE, Committer.corrigirEmail(email));

        this.email = Committer.corrigirEmail(email);
        this.name = name;
        this.avatar_url = avatar_url;
    }

    static corrigirEmail(email) {
        return email.replace(/@E-\d{6}\.(?=tcu\.gov\.br$)/g, '@');
    }

    static findAll() {
        return sesol2Repository.findAll(COMMITTER_TYPE)
    }
}

module.exports = Committer;