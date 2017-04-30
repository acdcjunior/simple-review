"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("../infra/rest");
const CodeReviewConfig_1 = require("../geral/CodeReviewConfig");
class TrelloService {
    static getCardsEmAndamento() {
        return rest_1.Rest.get(TrelloURLs.listEmAndamentoUrl());
    }
    static getCardsEmTestes() {
        return rest_1.Rest.get(TrelloURLs.listEmTestesUrl());
    }
}
exports.TrelloService = TrelloService;
class TrelloURLs {
    static listEmAndamentoUrl() {
        return TrelloURLs.listUrl(CodeReviewConfig_1.codeReviewConfig.trello.idListEmAndamento);
    }
    static listEmTestesUrl() {
        return TrelloURLs.listUrl(CodeReviewConfig_1.codeReviewConfig.trello.idListEmTestes);
    }
    static listUrl(idList) {
        return `https://api.trello.com/1/lists/${idList}?fields=name&cards=open&card_fields=name&key=${CodeReviewConfig_1.codeReviewConfig.trello.key}&token=${CodeReviewConfig_1.codeReviewConfig.trello.token}`;
    }
}
