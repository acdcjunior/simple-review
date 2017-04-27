"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commit_1 = require("./Commit");
const expect = require("chai").expect;
describe("Commit", function () {
    this.timeout(15000);
    const msgsMerges = [
        { message: `Merge branch 'desenvolvimento' of http://srv-scm.example.com/sti/sagas2.git into desenvolvimento`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'origin/desenvolvimento' into desenvolvimento`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'origin/master' into desenvolvimento`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'origin/master' into desenvolvimento
            
             blablabla:
	            sagas2Negocio/src/main/java/br/gov/tcu/sagas/negocio/instrucaogabinete/oficializarinstrucao/ServicoOficializarInstrucao.java`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'origin/master' into desenvolvimento
            
             Conflicts:
	            sagas2Negocio/src/main/java/br/gov/tcu/sagas/negocio/instrucaogabinete/oficializarinstrucao/ServicoOficializarInstrucao.java`, ehMergeSemConflito: false }
    ];
    msgsMerges.forEach((msgMerge, b) => {
        it("isCommitDeMergeSemConflito " + b, function () {
            const commit = new Commit_1.Commit('sha', 'title', msgMerge.message, 'email@autor.com', 'created_at');
            expect(commit.isCommitDeMergeSemConflito()).to.equal(msgMerge.ehMergeSemConflito);
        });
    });
});
