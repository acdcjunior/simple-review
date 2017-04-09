<?php

require_once  __DIR__ . "/../infra/couch/CouchSimple.php";

class Sesol2Repository
{
    private $couch;

    const NOME_DATABASE = "/sesol2";

    public function __construct()
    {
        $this->couch = new CouchSimple();
    }

    public function insert($key, $document)
    {
        return $this->couch->send("PUT", self::NOME_DATABASE . "/" . $key, json_encode($document));
    }

    public function insertIfNotExists($key, $document)
    {
        if (!$this->exists($key)) {
            echo "Not exists.\n";
            return $this->insert($key, $document);
        }
        echo "Exists.\n";
        return null;
    }

    public function exists($key)
    {
        return property_exists(json_decode($this->couch->send("GET", self::NOME_DATABASE . "/" . $key)), "_id");
    }

}