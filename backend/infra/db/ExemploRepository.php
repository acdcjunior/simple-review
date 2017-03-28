<?php
require "dao-utils.php";

$exemploRepo = new ExemploRepository();
$meuResult = $exemploRepo->doisParametros('param');


class ExemploRepository {

    function doisParametros($parametro)
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        return select(
            "SELECT d.documento, d.dt_diaria, d.valor, f.nome, f.cpf
             FROM diaria d INNER JOIN favorecido f ON d.favorecido = f.cpf
             WHERE f.nome LIKE CONCAT('%',?,'%') or f.cpf LIKE CONCAT('%',?,'%')
             LIMIT 10000",
            array($parametro, $parametro)
        );
    }

    function umParametro($parametro)
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        return select(
            "SELECT f.nome, sum(d.valor) as valor
             FROM diaria d
             GROUP BY f.nome
             HAVING sum(d.valor) >= ?",
            array($parametro)
        );
    }

    function nenhumParametro()
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        return select(
            "SELECT dt_diaria, sum(valor) as valor
             FROM diaria d
             GROUP BY dt_diaria
             ORDER BY dt_diaria",
            array()
        );
    }

}