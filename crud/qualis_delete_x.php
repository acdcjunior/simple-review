<?php

include('../cabecalho.php');

$id = (int) $_GET['id'];
if ($db->query("DELETE FROM `qualis` WHERE `id` = '$id' ") === TRUE) {
    echo "<h1>Linha apagada com sucesso.</h1>";
} else {
    echo "Error: " . $sql . "<br>" . $db->error;
}

?> 

<a href='qualis_list.php'>Voltar para listagem.</a>

<?php include('crud_rodape.php'); ?>