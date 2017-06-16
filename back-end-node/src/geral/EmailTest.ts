
import {Email} from "./Email";
const expect = require("chai").expect;

describe("Email", function () {
    this.timeout(15000);

    it("deve limpar email", function () {
        const email = new Email('nome@E-098571.tcu.gov.br');
        expect(email.email).to.equal('nome@tcu.gov.br');
    });

    it("se eh de estagiario", function () {
        //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedVariable,BadExpressionStatementJS
        expect(new Email('x12345678911@tcu.gov.br').isEmailDeEstagiario()).to.be.true;
        //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedVariable,BadExpressionStatementJS
        expect(new Email('x@tcu.gov.br').isEmailDeEstagiario()).to.be.false;
    });

});
