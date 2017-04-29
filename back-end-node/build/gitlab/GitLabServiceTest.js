"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rest_1 = require("../infra/rest");
const GitLabService_1 = require("./GitLabService");
const Email_1 = require("../geral/Email");
const CodeReviewConfig_1 = require("../geral/CodeReviewConfig");
describe("GitLabService", function () {
    this.timeout(15000);
    it("getUserByEmail", function () {
        const user = GitLabService_1.GitLabService.getUserByEmail(new Email_1.Email('antonio.junior@example.com'));
        return user.then((x) => console.log('ok', x)).catch((x) => console.log('err', x));
    });
    xit("criarImpersonationToken", function () {
        return GitLabService_1.GitLabService.criarImpersonationToken(20).then(retorno => {
            console.log('retorno', retorno);
            return Promise.resolve('ok!');
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
    let stub_Rest_get;
    let stub_GitLabConfig_projectsUrl;
    let stub_GitLabConfig_branchesUrl;
    beforeEach(() => {
        stub_GitLabConfig_projectsUrl = sandbox.stub(GitLabService_1.GitLabConfig, 'projectsUrl').returns('projectsUrl');
        stub_GitLabConfig_branchesUrl = sandbox.stub(GitLabService_1.GitLabConfig, 'branchesUrl').returns('branchesUrl');
        GitLabService_1.GitLabConfig.tokenAdmin = 'tokenAdmin';
        stub_Rest_get = sandbox.stub(rest_1.Rest, 'get')
            .onFirstCall().returns(Promise.resolve([{ name: 'branch-um' }, { name: 'branch-dois' }]));
    });
    it("garantir que sandbox estah sendo desfeita", function () { });
    it("getCommits", function () {
        stub_Rest_get = stub_Rest_get.onSecondCall().returns(Promise.resolve(['a', 'b']))
            .onThirdCall().returns(Promise.resolve(['c', 'd']));
        return GitLabService_1.GitLabService.getCommits().then((todosOsResultados) => {
            expect(stub_GitLabConfig_branchesUrl).to.have.been.callCount(1);
            expect(stub_GitLabConfig_projectsUrl).to.have.been.calledWith(sinon.match.any, 'branch-um', sinon.match.any);
            expect(stub_GitLabConfig_projectsUrl).to.have.been.calledWith(sinon.match.any, 'branch-dois', sinon.match.any);
            expect(stub_GitLabConfig_projectsUrl).to.have.been.callCount(2);
            expect(stub_Rest_get).to.have.been.calledWith('projectsUrl', 'tokenAdmin');
            expect(todosOsResultados).to.deep.equal(['a', 'b', 'c', 'd']);
        });
    });
    it("getBranches() deve ignorar branches ignorados", function () {
        CodeReviewConfig_1.codeReviewConfig.branchesIgnorados = ['branch-um'];
        return GitLabService_1.GitLabService.getBranches().then((branchesTrazidos) => {
            expect(stub_GitLabConfig_branchesUrl).to.have.been.callCount(1);
            expect(stub_Rest_get).to.have.been.calledWith('branchesUrl', 'tokenAdmin');
            expect(branchesTrazidos).to.deep.equal([{ name: 'branch-dois' }]);
        });
    });
});
