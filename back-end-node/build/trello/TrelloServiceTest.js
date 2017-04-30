"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TrelloService_1 = require("./TrelloService");
const GitLabServiceTest_1 = require("../gitlab/GitLabServiceTest");
describe("TrelloService", function () {
    this.timeout(15000);
    it("getCardsEmAndamento", function () {
        return GitLabServiceTest_1.printResults('getCardsEmAndamento', TrelloService_1.TrelloService.getCardsEmAndamento());
    });
    it("getCardsEmTestes", function () {
        return GitLabServiceTest_1.printResults('getCardsEmTestes', TrelloService_1.TrelloService.getCardsEmTestes());
    });
});
