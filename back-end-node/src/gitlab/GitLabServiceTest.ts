import * as sinon from 'sinon';
import * as chai from 'chai';
const expect    = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

import {Rest} from "../infra/rest";
import {GitLabURLs, GitLabService} from "./GitLabService";
import {Email} from "../geral/Email";
import {codeReviewConfig} from "../geral/CodeReviewConfig";

export function printResults(prefixo, promise) {
    return promise.then((x) => {
        console.log(prefixo + ' >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.dir(x);
        console.log(prefixo + ' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    }).catch((x) => {
        console.log(prefixo + 'ERRO!!!!!!!!!!!!!!!!! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        console.dir(x);
        console.log(prefixo + 'ERRO!!!!!!!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    });
}

describe("GitLabService integracao readonly", function () {
    this.timeout(15000);

    it("getUserByEmail", function () {
        const user = GitLabService.getUserByEmail(new Email('antonio.junior@'+'t'+'c'+'u'+'.'+'g'+'o'+'v'+'.'+'b'+'r'));
        return user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));
    });

    it("getTODOsCodeReviewPendentes", function () {
        return printResults(`getTodosCodeReviewPendentes`, GitLabService.getTODOsCodeReviewPendentes(`qSFmVvy6wDMfnsugRuAp`));          // CarlaNM @ delljr
    });

});

describe("GitLabService integracao write", function () {
    this.timeout(15000);

    xit("criarImpersonationToken", function () {
        return GitLabService.criarImpersonationToken(20).then(retorno => {
            console.log('retorno', retorno);
            return 'ok!';
        });
    });

    it("comentar", function () {
        return printResults(`comentar`, GitLabService.comentar(`14b6cfadee9055567071f2cae1d969bbeceb28c4`, `via IT`));
    });

    it("limparTodosRelativosACodeReviewGeradosPeloUsuarioComentador", function () {
        return printResults(`antes limpeza`, GitLabService.getTODOsCodeReviewPendentes(`qSFmVvy6wDMfnsugRuAp`)).then(() => {
            const user = GitLabService.limparTodosRelativosACodeReviewGeradosPeloUsuarioComentador({impersonationToken: `qSFmVvy6wDMfnsugRuAp`}); // CarlaNM @ delljr
            return user.then(() => {
                return printResults(`depois limpeza`, GitLabService.getTODOsCodeReviewPendentes(`qSFmVvy6wDMfnsugRuAp`)); // CarlaNM @ delljr
            });
        });
    });

});

describe("GitLabService com mocks", function () {
    this.timeout(15000);

    let sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    let stub_Rest_get: any;
    let stub_GitLabConfig_projectsUrl: any;
    let stub_GitLabConfig_branchesUrl: any;
    beforeEach(() => {
        stub_GitLabConfig_projectsUrl = sandbox.stub(GitLabURLs, 'projectsUrl').returns('projectsUrl');
        stub_GitLabConfig_branchesUrl = sandbox.stub(GitLabURLs, 'branchesUrl').returns('branchesUrl');
        (codeReviewConfig as any).tokenAdmin = 'tokenAdmin';

        stub_Rest_get = sandbox.stub(Rest, 'get')
            .onFirstCall().returns(Promise.resolve([{name: 'branch-um'}, {name: 'branch-dois'}]));
    });

    it("garantir que sandbox estah sendo desfeita", function () {});

    it("getCommits", function () {
        stub_Rest_get = stub_Rest_get.onSecondCall().returns(Promise.resolve(['a', 'b']))
                                     .onThirdCall().returns(Promise.resolve(['c', 'd']));

        return GitLabService.getCommits().then((todosOsResultados) => {
            expect(stub_GitLabConfig_branchesUrl).to.have.been.callCount(1);
            expect(stub_GitLabConfig_projectsUrl).to.have.been.calledWith(sinon.match.any, 'branch-um', sinon.match.any);
            expect(stub_GitLabConfig_projectsUrl).to.have.been.calledWith(sinon.match.any, 'branch-dois', sinon.match.any);
            expect(stub_GitLabConfig_projectsUrl).to.have.been.callCount(2);
            expect(stub_Rest_get).to.have.been.calledWith('projectsUrl', 'tokenAdmin');
            expect(todosOsResultados).to.deep.equal(['a', 'b', 'c', 'd']);
        });
    });

    it("getBranches() deve ignorar branches ignorados", function () {
        (codeReviewConfig.projeto as any).branchesIgnorados = ['branch-um'];

        return GitLabService.getBranches().then((branchesTrazidos) => {
            expect(stub_GitLabConfig_branchesUrl).to.have.been.callCount(1);
            expect(stub_Rest_get).to.have.been.calledWith('branchesUrl', 'tokenAdmin');
            expect(branchesTrazidos).to.deep.equal([{name: 'branch-dois'}]);
        });
    });

});
