<?php
include('cabecalho.php');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$commits = rest("GET", "https://gitlab.com/api/v4/projects/2982376/repository/commits/?since=2017-03-26T22:14:54.000-03:00");

echo "<table border='1'>";

function cell($c) {
    return "<td>$c</td>";
}
foreach($commits as $commit) {
    echo "<tr>";
    echo cell($commit->id);
    echo cell($commit->message);
    echo cell($commit->author_email);
    echo cell($commit->authored_date);


    /** @noinspection SqlDialectInspection */
    /** @noinspection SqlNoDataSourceInspection */
    $sql = "
    INSERT INTO `codereview`
    (
      `sha`,
      `message`,
      `author_email`,
      `authored_date`
    )
    VALUES
    (
      '$commit->id',
      '$commit->message',
      '$commit->author_email',
      '$commit->authored_date'
    )
    ";

    if ($db->query($sql) === TRUE) {
        echo cell("Sucesso");
    } else {
        echo cell("Erro: " . $sql . "<br>" . $db->error);
    }
    echo "</tr>";

}
echo "</table>";