"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TrelloService_1 = require("./TrelloService");
const GitLabServiceTest_1 = require("../gitlab/GitLabServiceTest");
describe("TrelloService", function () {
    this.timeout(15000);
    it("getListEmAndamento", function () {
        return GitLabServiceTest_1.printResults('getListEmAndamento', TrelloService_1.TrelloService.getListEmAndamento());
    });
    it("getListEmTestes", function () {
        return GitLabServiceTest_1.printResults('getListEmTestes', TrelloService_1.TrelloService.getListEmTestes());
    });
});
