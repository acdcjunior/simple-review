<?php

include('calcularSiglaSintetica.php');

/*
    https://ppca-2016-2.slack.com/archives/mineracao/p1484746495000002

    ATENCAO: O ALGORITMO AINDA NAO FOI IMPLEMENTADO, ESTA SO COMECANDO
    
    Sugestao inicial:
    - Comparar pela sigla, se achar só um, retorna essa mesmo
    - Se retornar mais de 1, ver se titulo bate
        - Se bater só com um, retorna
        - Se não bater com nenhum calcular edit distance e selecionar o de menor distancia
        
    IMPORTANTE: O campo sigla a ser usado eh o campo `SIGLA_EFETIVA`, que eh preenchido
    com um valor sintetico (gerado), mesmo quando o evento nao teve sigla cadastrada.

*/
function calcularClassificacaoQualis($siglaDoEventoComAno, $tituloDoEventoComAno) {
    $siglaDoEventoSemAno = removerAnoDaSigla($siglaDoEventoComAno);
    $tituloDoEventoSemAno = removerAnoDoTitulo($tituloDoEventoComAno);
    return calcularBySiglaExata($siglaDoEventoSemAno, $tituloDoEventoSemAno);
}

function calcularBySiglaExata($siglaDoEventoSemAno, $tituloDoEventoSemAno) {
    $bySiglaExatamente = getBySiglaExatamente($siglaDoEventoSemAno);

    $qtdEncontrados = sizeof($bySiglaExatamente);
    if ($qtdEncontrados === 1) {
        return resultado($bySiglaExatamente[0]['qualis'], "Caso #1: Encontrada uma classificação com essa sigla <u>cadastrada</u>: ". formatarResultado($bySiglaExatamente[0]));
    }
    if ($qtdEncontrados > 1) {
        return calcularBySiglaExataETitulo($siglaDoEventoSemAno, $tituloDoEventoSemAno);
    } else { // $qtdEncontrados === 0
        return calcularBySiglaEfetiva($siglaDoEventoSemAno, $tituloDoEventoSemAno);
    }
}

function calcularBySiglaExataETitulo($siglaDoEventoSemAno, $tituloDoEventoSemAno) {
    $bySiglaExataETitulo = getBySiglaExataETitulo($siglaDoEventoSemAno, $tituloDoEventoSemAno);

    $qtdEncontrados = sizeof($bySiglaExataETitulo);
    if ($qtdEncontrados === 1) {
        return resultado($bySiglaExataETitulo[0]['qualis'], "Caso #2: Encontrada uma classificação com, simultaneamente, essa sigla <u>cadastrada</u> <i><b>e</b></i>
                                                                    esse título ('".$tituloDoEventoSemAno."'): ". formatarResultado($bySiglaExataETitulo[0]));
    }
    if ($qtdEncontrados > 1) {
        return reportarMultiplosResultados($bySiglaExataETitulo, "Caso #3: Encontradas múltiplas classificações (" . $qtdEncontrados . ") com, simultaneamente,
                                                                                    essa sigla <u>cadastrada</u> <i><b>e</b></i> esse título ('".$tituloDoEventoSemAno."'): ");
    } else { // $qtdEncontrados === 0
        $bySiglaExatamente = getBySiglaExatamente($siglaDoEventoSemAno);
        return reportarMultiplosResultados($bySiglaExatamente, "Caso #4: Encontradas múltiplas classificações (" . sizeof($bySiglaExatamente) . ") com
                                                                                essa sigla <u>cadastrada</u>,<br> porém nenhuma bateu exatamente o título ('".$tituloDoEventoSemAno."'): ");
    }
}

function calcularBySiglaEfetiva($siglaDoEventoSemAno, $tituloDoEventoSemAno) {
    $bySiglaEfetiva = getBySiglaEfetiva($siglaDoEventoSemAno);

    $qtdEncontrados = sizeof($bySiglaEfetiva);
    if ($qtdEncontrados === 1) {
        return resultado($bySiglaEfetiva[0]['qualis'], "Caso #5: Encontrada uma classificação com essa sigla <u>sintética</u> (isto é, gerada pelo sistema com
                                                                base no título): ". formatarResultado($bySiglaEfetiva[0]));
    }
    if ($qtdEncontrados > 1) {
        return calcularBySiglaEfetivaETitulo($siglaDoEventoSemAno, $tituloDoEventoSemAno);
    } else { // $qtdEncontrados === 0
        return resultado("-", "Caso #6: Nenhuma classificação encontrada para essa sigla.");
    }
}

function calcularBySiglaEfetivaETitulo($siglaDoEventoSemAno, $tituloDoEventoSemAno) {
    $bySiglaEfetivaETitulo = getBySiglaExataETitulo($siglaDoEventoSemAno, $tituloDoEventoSemAno);

    $qtdEncontrados = sizeof($bySiglaEfetivaETitulo);
    if ($qtdEncontrados === 1) {
        return resultado($bySiglaEfetivaETitulo[0]['qualis'], "Caso #7: Encontrada uma classificação com, simultaneamente, essa sigla <u>sintética</u> (isto é, gerada pelo sistema com
                                                                base no título) <i><b>e</b></i> esse título ('".$tituloDoEventoSemAno."'): ". formatarResultado($bySiglaEfetivaETitulo[0]));
    }
    if ($qtdEncontrados > 1) {
        return reportarMultiplosResultados($bySiglaEfetivaETitulo, "Caso #8: Encontradas múltiplas classificações (" . $qtdEncontrados . ") com, simultaneamente,
                                                                                    essa sigla <u>sintética</u> (isto é, gerada pelo sistema com base no título) <i><b>e</b></i>
                                                                                    esse título ('".$tituloDoEventoSemAno."'): ");
    } else { // $qtdEncontrados === 0
        $bySiglaEfetiva = getBySiglaEfetiva($siglaDoEventoSemAno);
        return reportarMultiplosResultados($bySiglaEfetiva, "Caso #9: Encontradas múltiplas classificações (" . sizeof($bySiglaEfetiva) . ") com
                                                                                essa sigla <u>sintética</u> (isto é, gerada pelo sistema com base no título),<br> porém nenhuma 
                                                                                bateu exatamente o título ('".$tituloDoEventoSemAno."'): ");
    }
}



function reportarMultiplosResultados($todosResultados, $mensagem) {
    $multiplosResultadosConcatenados = "";
    $numeroResultados = sizeof($todosResultados);
    for ($i = 0; $i < $numeroResultados; $i++) {
        $multiplosResultadosConcatenados .= formatarResultado($todosResultados[$i]);
    }
    return resultado("Várias*", $mensagem . $multiplosResultadosConcatenados);
}
function formatarResultado($linhaQualis) {
    return "<hr>Sigla: " . $linhaQualis['sigla_efetiva'] .
           "<br>Qualis: " . $linhaQualis['qualis'] .
           "<br>Título: " . $linhaQualis['titulo'] .
           "<hr>";
}


function removerAnoDaSigla($sigla) {
    return preg_replace("/(19|20)\d\d/", "", trim($sigla));
}
function removerAnoDoTitulo($titulo) {
    return removerStopWords(trim($titulo));
}

function resultado($qualis, $razao) {
    $obj = new stdClass;
    $obj->qualis = $qualis;
    $obj->razao = $razao;
    return $obj;
}

function getBySiglaExatamente($sigla) {
    global $db;
    return goSQL("SELECT `qualis`, `titulo`, `sigla_efetiva`, `sigla` FROM `qualis` WHERE `sigla` = '".$db->real_escape_string($sigla)."'");
}
function getBySiglaEfetiva($sigla) {
    global $db;
    return goSQL("SELECT `qualis`, `titulo`, `sigla_efetiva`, `sigla` FROM `qualis` WHERE `sigla_efetiva` = '".$db->real_escape_string($sigla)."'");
}
function getBySiglaExataETitulo($sigla, $titulo) {
    global $db;
    return goSQL("SELECT `qualis`, `titulo`, `sigla_efetiva`, `sigla` FROM `qualis` WHERE `sigla` = '".$db->real_escape_string($sigla)."' AND `titulo` COLLATE UTF8_GENERAL_CI like '%".$db->real_escape_string($titulo)."%'");
}
function getBySiglaEfetivaETitulo($sigla, $titulo) {
    global $db;
    return goSQL("SELECT `qualis`, `titulo`, `sigla_efetiva`, `sigla` FROM `qualis` WHERE `sigla_efetiva` = '".$db->real_escape_string($sigla)."' AND `titulo` COLLATE UTF8_GENERAL_CI like '%".$db->real_escape_string($titulo)."%'");
}

function goSQL($sql) {
    global $db;
    $data = array();
    
    $query = $db->query($sql);

    while($row = $query->fetch_array(MYSQLI_ASSOC)) {
        $data[] = $row;
    }
    return $data;
}