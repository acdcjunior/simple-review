import {Rest} from "../infra/rest";
import {codeReviewConfig} from "../geral/CodeReviewConfig";

export class TrelloService {

    static getCardsEmAndamento(): Promise<TrelloList> {
        return Rest.get<TrelloList>(TrelloURLs.listEmAndamentoUrl());
    }

    static getCardsEmTestes(): Promise<TrelloList> {
        return Rest.get<TrelloList>(TrelloURLs.listEmTestesUrl());
    }

}

class TrelloURLs {

    static listEmAndamentoUrl(): string {
        return TrelloURLs.listUrl(codeReviewConfig.trello.idListEmAndamento);
    }
    static listEmTestesUrl(): string {
        return TrelloURLs.listUrl(codeReviewConfig.trello.idListEmTestes);
    }

    static listUrl(idList: string): string {
        return `https://api.trello.com/1/lists/${idList}?fields=name&cards=open&card_fields=name&key=${codeReviewConfig.trello.key}&token=${codeReviewConfig.trello.token}`;
    }

}

interface TrelloList {
    readonly id: string; // "55f330f3d5e843170cb83d1a",
    readonly name: string; // "Em andamento [4]"
    readonly cards: TrelloCard[];
}

interface TrelloCard {
    readonly id: string; // "58beb1f55a00016edec98c29",
    readonly name: string; // "Implementar Retomar instrução_release4"
}