<?php

require_once "../infra/couch/CouchSimple.php";

class Sesol2Repository
{
    private $couch;

    const NOME_DATABASE = "/sesol2";

    public function __construct()
    {
        $this->couch = new CouchSimple();
    }

    public function insertIfNotExists($commit)
    {
        return $this->insert($commit);
    }

    public function insert($commit)
    {
        $post_data = json_encode($commit);
        echo "INserindo: $post_data";

        return $this->couch->send("POST", self::NOME_DATABASE, $post_data);
    }

}