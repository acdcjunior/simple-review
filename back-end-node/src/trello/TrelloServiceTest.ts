import {TrelloService} from "./TrelloService";
import {printResults} from "../gitlab/GitLabServiceTest";

describe("TrelloService", function () {
    this.timeout(15000);

    it("getListEmAndamento", function () {
        return printResults('getListEmAndamento', TrelloService.getListEmAndamento());
    });

    it("getListEmTestes", function () {
        return printResults('getListEmTestes', TrelloService.getListEmTestes());
    });

});
