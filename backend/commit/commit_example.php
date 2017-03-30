<?php

require_once "Sesol2Repository.php";
require_once "Commit.php";

$commit = new Commit("a2", "titulo do commit", "meu commit", "a@s", "2017-03-03");
var_dump($commit);

$sesol2Repository = new Sesol2Repository();
echo $sesol2Repository->insert($commit);