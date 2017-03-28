<?php
require_once "infra/db/dao-utils.php";


class CodeReviewRepository {

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

    function findBySha($sha)
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        return select("SELECT * from `code_review` WHERE `sha` = ?",
            array($sha)
        );
    }

    function exists($sha)
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        return sizeof(select("SELECT * from `code_review` WHERE `sha` = ?", array($sha))) !== 0;
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

    function insert($sha, $message, $author_email, $created_at)
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        insert("INSERT INTO `code_review` (`sha`, `message`, `author_email`, `created_at`) VALUES (?,?,?,?)",
            array($sha, $message, $author_email, $created_at));
    }

    function insertIfNotExists($sha, $message, $author_email, $created_at)
    {
        if (!$this->exists($sha)) {
            $this->insert($sha, $message, $author_email, $created_at);
        }
    }

}