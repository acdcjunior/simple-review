import * as Utils from "../util/Utils";
import {carregarCommitters} from "./carregarCommitters";
import {carregarCommits} from "./carregarCommits";


export default function carregarCommitsAndCommitters() {
    console.log('Iniciando carga de committers e commits...');
    Utils.printBar();

    return carregarCommitters().then(() => {
        carregarCommits();
    });
}