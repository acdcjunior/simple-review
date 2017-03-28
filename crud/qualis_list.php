<?php 

include('../cabecalho.php');
include('../utils.php');

$start = 0;
$limit = 10;

if (isset($_GET['pagina'])) {
    $pagina = (int) $_GET['pagina'];
    if ($pagina == 0) {
        $pagina = 1;
    }
    $start = ($pagina-1)*$limit;
}
if (!isset($pagina) || $pagina < 1) {
    $pagina = 1;
}

?>

<h3>Classificações Qualis Cadastradas</h3>
<table class="bordered striped centered responsive-table">
    <thead>
    <tr>
        <th style="width: 40%"><b>Título</b></th>
        <th style="width: 20%"><b>Sigla</b></th>
        <th style="width: 5%"><b>Qualis</b></th>
        <th style="width: 10%"><b>Outros Metadados</b></th>
        <th style="width: 5%"><b>Fonte</b></th>
        <th style="width: 5%">&nbsp;</th>
    </tr>
    </thead>
    <tbody>

<?php
    function nulavel($nomeCampo, $artigo, $valorCampo) {
        if (strlen($valorCampo) > 0) {
            return truncavel($valorCampo, 18);
        } else {
            $nenhum = $artigo == "a" ? "a" : "";
            return "
            >
            <span class='tooltipped' data-position='bottom' data-delay='10' data-tooltip='Nenhum$nenhum $nomeCampo fornecid$artigo, ainda. Clique em editar para adicioná-l$artigo.'>
                <i class='material-icons'>not_interested</i>
            </span>
            ";
        }
    }
    function truncavel($valorCampo, $tamanhoMax) {
        return " class='tooltipped' data-delay='10' data-tooltip='".nl2br($valorCampo)."'>" . (strlen($valorCampo) > $tamanhoMax ? substr($valorCampo, 0, $tamanhoMax)."..." : $valorCampo);
    }


    $query = $db->query("SELECT `id`, `sigla`, `sigla_efetiva`, `titulo`, `qualis`, `fonte`, `metadados` FROM `qualis` order by titulo, sigla LIMIT $start, $limit");
    while($row = $query->fetch_array(MYSQLI_ASSOC)) { 
        foreach($row AS $key => $value) { if ($key !== 'metadados') $row[$key] = stripslashes($value); }
        echo "<tr>";  
        echo "<td valign='top' class='tooltipped' data-delay='1000' data-tooltip='Id desta linha no banco: ".$row['id']."'>" . nl2br( $row['titulo']) . "</td>";
        
        if (empty(trim($row['sigla']))) {
            echo "<td class='tooltipped' data-position='bottom' data-delay='10' data-tooltip='Nenhuma sigla foi fornecida via cadastro. A sigla exibida foi calculada automaticamente com base no título.'>".
                 $row['sigla_efetiva']."<i class='material-icons' style='margin-top: 10px'>local_offer</i>
                </td>";  
        } else {
            echo "<td valign='top' " . nulavel("sigla", "a", $row['sigla']) . "</td>";  
        }
        
        echo "<td valign='top'>" . nl2br( $row['qualis']) . "</td>";

        //<editor-fold desc="COLUNA METADADOS">
            echo "<td valign='top' class='tooltipped' data-delay='10' data-tooltip=\"";
            if ($row['metadados'] !== '' and $row['metadados'] !== '{}') {
                $metadados = json_decode($row['metadados'] === '' ? '{}' : $row['metadados']);
                foreach ($metadados as $nomePropriedade => $valorPropriedade) {
                    echo quoteHTML($nomePropriedade) . ": " . quoteHTML($valorPropriedade) . "<br>";
                }
            } else {
                echo "Nenhum metadado cadastrado para este item.";
            }
            echo "\"><i class=\"material-icons\">subtitles</i></td>";
        //</editor-fold>

        echo "<td valign='top' " . truncavel($row['fonte'], 5) . "</td>";
        echo "<td valign='top'>"
        ?>
        <a class="btn-floating btn waves-effect waves-light tooltipped" data-position='bottom' data-delay='10' data-tooltip='Editar classificação' href="qualis_edit.php?id=<?=$row['id']?> "><i class="material-icons">edit</i></a>
        <?php
        if (isset($_GET['showdel'])) {
            ?>
            <a class="btn-floating btn waves-effect waves-light tooltipped deep-orange lighten-5"
               data-position='bottom' data-delay='10' data-tooltip='Apagar classificação'
               href="qualis_delete_x.php?id=<?=$row['id']?>" onclick="if (!confirm('Tem certeza que deseja apagar esta linha?')) return false;">
                <i class="material-icons">delete</i>
            </a>
            <?php
        }
        echo "</td> "; 
        echo "</tr>"; 
    }
?>
    </tbody>
</table>
<br>
<?php
    $rows = $db->query("SELECT 1 FROM `qualis`")->num_rows;
    $total = ceil($rows/$limit);
?>
    <div class="container">
        <div class="row">
            <div class="col s6">
                <ul class="pagination">
                    <?php
                        if ($pagina > 1) {
                            echo "<li class='waves-effect'><a href='?pagina=".($pagina-1)."'><i class='material-icons'>chevron_left</i></a></li>";
                        } else {
                            echo "<li class='disabled'><a href='#!'><i class='material-icons'>chevron_left</i></a></li>";
                        }
                        echo "<li class='active'><a href='#!'>$pagina</a></li>";
                        
                        if ($pagina != $total) {
                            echo "<li class='waves-effect'><a href='?pagina=".($pagina+1)."'><i class='material-icons'>chevron_right</i></a></li>";
                        } else {
                            echo "<li class='disabled'><a href='#!'><i class='material-icons'>chevron_right</i></a></li>";
                        }
                    ?>
                </ul>
            </div>
            <div class="col s6" style="padding-top: 20px">
                Total de <?= $rows ?> registros na base.
            </div>
        </div>
    </div>
    
    <br>
<a class="btn-floating btn-large waves-effect waves-light tooltipped blue" data-position='bottom' data-delay='10' data-tooltip='Incluir nova classificação' href="qualis_new.php"><i class="material-icons">add</i></a>

<?php

if (isset($_GET['showdel'])) {
    ?>
    <a href='../calculo/sigla.php'>Abrir pagina de sigla</a>
    <?php
}

include('crud_rodape.php');
