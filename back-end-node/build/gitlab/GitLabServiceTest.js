"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitLabService_1 = require("./GitLabService");
const Email_1 = require("../geral/Email");
//noinspection JSUnusedLocalSymbols
const expect = require("chai").expect;
describe("GitLabService", function () {
    this.timeout(15000);
    it("getUserByEmail", function () {
        const user = GitLabService_1.GitLabService.getUserByEmail(new Email_1.Email('antonio.junior@example.com'));
        return user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));
    });
    it("criarImpersonationToken", function () {
        return GitLabService_1.GitLabService.criarImpersonationToken(20).then(retorno => {
            console.log('retorno', retorno);
            return Promise.resolve('ok!');
        });
    });
});
