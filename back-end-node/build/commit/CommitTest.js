"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Commit_1 = require("./Commit");
const expect = require("chai").expect;
describe("Commit", function () {
    this.timeout(15000);
    const msgsMerges = [
        { message: `Merge branch 'desenvolvimento' of http://srv-scm.example.com.br/sti/sistema2.git into desenvolvimento`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'origin/desenvolvimento' into desenvolvimento`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'origin/master' into desenvolvimento`, ehMergeSemConflito: true },
        { message: `Merge branch 'terceiro-branch' into desenvolvimento\n`, ehMergeSemConflito: true },
        { message: `Merge branch 'terceiro_branch' into desenvolvimento\n`, ehMergeSemConflito: true },
        { message: `Merge branch 'desenvolvimento'`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'remotes/origin/desenvolvimento'`, ehMergeSemConflito: true },
        { message: `Merge branch 'desenvolvimento' of http://srv-scm.bob.net.br/sti/sistema2 into desenvolvimento`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'origin/master' into desenvolvimento
            
             blablabla:
	            sistema2Negocio/src/main/java/br/com/example/sistema/negocio/instrucaogabinete/oficializarinstrucao/ServicoOficializarInstrucao.java`, ehMergeSemConflito: true },
        { message: `Merge remote-tracking branch 'origin/master' into desenvolvimento
            
             Conflicts:
	            sistema2Negocio/src/main/java/br/com/example/sistema/negocio/instrucaogabinete/oficializarinstrucao/ServicoOficializarInstrucao.java`, ehMergeSemConflito: false }
    ];
    msgsMerges.forEach((msgMerge, index) => {
        it(`isCommitDeMergeSemConflito ${index}: ${msgMerge.message}`, function () {
            const commit = new Commit_1.Commit('sha', 'title', msgMerge.message, 'email@autor.com', 'created_at');
            expect(commit.isCommitDeMergeSemConflito()).to.equal(msgMerge.ehMergeSemConflito);
        });
    });
});
