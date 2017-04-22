
import {Email} from "./Email";
const expect = require("chai").expect;

describe("Email", function () {
    this.timeout(15000);

    it("deve limpar email", function () {
        const email = new Email('nome@E-098571.example.com');
        expect(email.email).to.equal('nome@example.com');
    });

    it("se eh de estagiario", function () {
        //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedVariable,BadExpressionStatementJS
        expect(new Email('x12345678911@example.com').isEmailDeEstagiario()).to.be.true;
        //noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedVariable,BadExpressionStatementJS
        expect(new Email('x@example.com').isEmailDeEstagiario()).to.be.false;
    });

});
