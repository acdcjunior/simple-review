import {TrelloService} from "./TrelloService";
import {printResults} from "../gitlab/GitLabServiceTest";

describe("TrelloService", function () {
    this.timeout(15000);

    it("getCardsEmAndamento", function () {
        return printResults('getCardsEmAndamento', TrelloService.getCardsEmAndamento());
    });

    it("getCardsEmTestes", function () {
        return printResults('getCardsEmTestes', TrelloService.getCardsEmTestes());
    });

});
