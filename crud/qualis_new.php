<?php

include('../cabecalho.php');
include('../calculo/calcularSiglaSintetica.php');

if (isset($_POST['submitted'])) { 
  foreach($_POST AS $key => $value) { $_POST[$key] = $db->real_escape_string($value); } 
  
  $titulo = "{$_POST['titulo']}";
  $siglaEfetiva = trim("{$_POST['sigla']}");
  if (empty($siglaEfetiva)) {
    $siglaEfetiva = calcularSiglaSintetica($titulo);
  }
  
  $sql = "
    INSERT INTO `qualis`
    (
      `sigla`,
      `sigla_efetiva`,
      `titulo`,
      `qualis`,
      `fonte`
    )
    VALUES
    (
      '{$_POST['sigla']}',
      '$siglaEfetiva',
      '$titulo',
      '{$_POST['qualis']}',
      '{$_POST['fonte']}'
    )
    "; 

  if ($db->query($sql) === TRUE) {
    echo "
        <h2>Linha adicionada com sucesso.</h2>
        <br>
        <a href='qualis_edit.php?id=".$db->insert_id."'>Clique aqui para continuar a edição do item inserido (e adicionar outros metadados).</a>
        <br>
        <a href='qualis_list.php'>Clique aqui para voltar para a listagem.</a>";
  } else {
    echo "Erro: " . $sql . "<br>" . $db->error;
  }

  return;
} 

include('qualis_formulario.php');

qualisFormulario('Nova Classificação Qualis', 'Inserir', false, null);

include('crud_rodape.php');