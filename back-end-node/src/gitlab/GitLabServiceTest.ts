import {GitLabService} from "./GitLabService";
import {Email} from "../geral/Email";

//noinspection JSUnusedLocalSymbols
const expect = require("chai").expect;

describe("GitLabService", function () {
    this.timeout(15000);

    it("getUserByEmail", function () {
        const user = GitLabService.getUserByEmail(new Email('antonio.junior@example.com'));
        return user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));
    });

    xit("criarImpersonationToken", function () {
        return GitLabService.criarImpersonationToken(20).then(retorno => {
            console.log('retorno', retorno);
            return Promise.resolve('ok!');
        });
    });

});
