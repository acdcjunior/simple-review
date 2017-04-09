<?php

echo "<h1>Carregando commits...</h1><pre>";

require_once "infra/rest.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


//$commits = rest("GET", "https://gitlab.com/api/v4/projects/2982376/repository/commits/?since=2017-03-26T22:14:54.000-03:00", "zZKohysiaQwizBySUF2N");
//$commits = rest("GET", "http://git/api/v3/projects/123/repository/commits/?ref_name=desenvolvimento&per_page=100", "EsspXz7kinZN9RayS8sG");
$commits = rest("GET", "http://192.168.56.1:8090/api/v4/projects/1/repository/commits/?ref_name=develop&per_page=100", "1srXHf4y3NsUC6xtzfLz");

require_once "commit/Sesol2Repository.php";
require_once "commit/Commit.php";
require_once "commit/Committer.php";


$sesol2Repository = new Sesol2Repository();

$committers = array();
foreach($commits as $commit) {
    echo "Commit: $commit->title\n";
    $committers[] = $commit->author_email;

    echo $sesol2Repository->insertIfNotExists(
        $commit->id,
        new Commit($commit->id, $commit->title, $commit->message, $commit->author_email, $commit->created_at)
    );
}

echo "<hr>";

$committers = array_unique($committers);
foreach($committers as $committer) {
//    $users = rest("GET", "http://git/api/v3/users/?search=$committer", "EsspXz7kinZN9RayS8sG");
    $users = rest("GET", "http://192.168.56.1:8090/api/v4/users/?search=$committer", "1srXHf4y3NsUC6xtzfLz");

    foreach ($users as $user) {
        echo "Committer: $committer\n";
        echo $sesol2Repository->insertIfNotExists(
            $committer,
            new Committer($committer, $user->name, $user->avatar_url)
        );
    }
}

echo "</pre><h5>Fim!</h5>";