<?php
require 'vendor/autoload.php';
require "DiariasRepository.php";

$app = new Slim\App();
$diariasRepo = new ExemploRepository();

/* CORS - INICIO */
$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});
$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
        ->withHeader('Access-Control-Allow-Origin', $_SERVER['HTTP_ORIGIN'])
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});
/* CORS - FIM */

$app->get('/diarias-por-favorecido', function ($request, $response) {
    global $exemploRepo;
    return $response->withStatus(200)->withJson($exemploRepo->doisParametros($request->getQueryParam('busca', '')));
});
$app->get('/diarias-por-orgao', function ($request, $response) {
    global $exemploRepo;
    return $response->withStatus(200)->withJson($exemploRepo->diariasPorOrgao($request->getQueryParam('busca', '')));
});
$app->get('/valor-por-programa', function ($request, $response) {
    global $exemploRepo;
    return $response->withStatus(200)->withJson($exemploRepo->valorPorPrograma($request->getQueryParam('busca', '')));
});
$app->get('/valor-por-funcao', function ($request, $response) {
    global $exemploRepo;
    return $response->withStatus(200)->withJson($exemploRepo->umParametro($request->getQueryParam('busca', '')));
});
$app->get('/valor-por-dia', function ($request, $response) {
    global $exemploRepo;
    return $response->withStatus(200)->withJson($exemploRepo->nenhumParametro($request->getQueryParam('busca', '')));
});

$app->run();