<?php
require_once "infra/db/dao-utils.php";


class CommitterRepository {

    function avatar($email)
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        return select(
            "SELECT `avatar` FROM `committer` WHERE `email` = ?",
            array($email)
        );
    }

    function insert($email, $nome, $avatar_url)
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        insert(
            "INSERT INTO `committer` (`email`, `nome`, `avatar_url`) VALUES (?,?,?)",
            array($email, $nome, $avatar_url)
        );
    }

    function exists($email)
    {
        /** @noinspection SqlDialectInspection */
        /** @noinspection SqlNoDataSourceInspection */
        return sizeof(select("SELECT * from `committer` WHERE `email` = ?", array($email))) !== 0;
    }

    function insertIfNotExists($email, $nome, $avatar_url)
    {
        if (!$this->exists($email)) {
            $this->insert($email, $nome, $avatar_url);
        }
    }

}