<?php

require_once "infra/rest.php";
require_once "CodeReviewRepository.php";
require_once "CommitterRepository.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


//$commits = rest("GET", "https://gitlab.com/api/v4/projects/2982376/repository/commits/?since=2017-03-26T22:14:54.000-03:00", "zZKohysiaQwizBySUF2N");
$commits = rest("GET", "http://git/api/v3/projects/123/repository/commits/?ref_name=desenvolvimento&per_page=100", "EsspXz7kinZN9RayS8sG");


$committerRepository = new CommitterRepository();
$codeReviewRepository = new CodeReviewRepository();

$committers = array();
foreach($commits as $commit) {
    $committers[] = $commit->author_email;
    $codeReviewRepository->insertIfNotExists($commit->id, $commit->message, $commit->author_email, $commit->created_at);
}

$committers = array_unique($committers);
foreach($committers as $committer) {
    $users = rest("GET", "http://git/api/v3/users/?search=$committer", "EsspXz7kinZN9RayS8sG");

    if (sizeof($users) === 1) {
        $user = $users[0];
        $committerRepository->insertIfNotExists($committer, $user->name, $user->avatar_url);
    }
}
echo "Sucesso!";