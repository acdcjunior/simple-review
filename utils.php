<?php

function metadadosToStringList($postedMetadados) {
    // remove { inicial e } final
    // troca os : (entre valor:propriedade) no meio por ,
    $jsonMetadados = stripcslashes($postedMetadados);
    $aposReplace = preg_replace('/((?<=[{,])"([^"]+)"):/', "$1,", $jsonMetadados);
    return substr(trim($aposReplace),1,-1);
}

function quoteHTML($texto) {
    return preg_replace('/"/', "&quot;", $texto);
}