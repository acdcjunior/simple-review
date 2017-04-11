const Sesol2 = require('./Sesol2');

class Committer extends Sesol2
{
    constructor(email, name, avatar_url)
    {
        super(Committer.corrigirEmail(email), 'committer', Committer.corrigirEmail(email));

        this.email = Committer.corrigirEmail(email);
        this.name = name;
        this.avatar_url = avatar_url;
    }

    static corrigirEmail(email) {
        return email.replace(/@E-\d{6}\.(?=tcu\.gov\.br$)/g, '@');
    }

}

module.exports = Committer;