import {Committer} from "../committers/Committer";
import {CommitterRepository} from "../committers/CommitterRepository";
import {Commit} from "../commit/Commit";

export class MencoesExtractor {

    public static extrairCommittersMencionadosNaMensagemDoCommit(commitSemRevisor: Commit): Promise<Committer[]> {
        return MencoesExtractor.extrairCommittersMencionadosNoTexto(commitSemRevisor.message);
    }

    public static extrairCommittersMencionadosNoTexto(texto: string): Promise<Committer[]> {
        const mencoes: string[] = texto.match(/@[a-zA-Z.0-9]+/g) || [];

        return Promise.all(
            mencoes
                .map(mencaoComArroba => mencaoComArroba.substring(1))
                .map(mencaoSemArroba => mencaoSemArroba.toLowerCase())
                .map(CommitterRepository.findCommitterByUsernameOrAlias)
        );
    }

}
