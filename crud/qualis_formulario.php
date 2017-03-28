<?php

function qualisFormulario($tituloFormulario, $labelBotaoEnviar, $metadados, $row)
{
    ?>
    <div class="container">
        <div class="row">
            <h1><?= $tituloFormulario ?></h1>
        </div>
        <div class="row">
            <form action='' method='POST' class="col s12" onsubmit="btnSubmit.disabled = true">

                <div class="row">
                    <div class="input-field col s12">
                        <input type="text" class="validate" id="titulo" name='titulo' required
                               value='<?= stripslashes($row['titulo']) ?>'><label for="titulo">Título (Ex.: IEEE
                            TRANSACTIONS ON SOFTWARE ENGINEERING)</label>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s12">
                        <input type="text" class="validate" id="sigla" name='sigla'
                               value='<?= stripslashes($row['sigla']) ?>'><label for="sigla">Sigla do Evento (Ex.:
                            BRCOM, IEEE-ICDDM, etc.)</label>
                    </div>
                </div>

                <div class="row">
                    <label>Classificação (Estrato) Qualis do Evento</label>
                    <select id="qualis" name='qualis' required class="browser-default">
                        <option value="" disabled selected>Selecione a classificação Qualis deste evento</option>
                        <option <?= ($row['qualis'] == 'C') ? 'selected' : '' ?>>C
                        <option <?= ($row['qualis'] == 'B5') ? 'selected' : '' ?>>B5
                        <option <?= ($row['qualis'] == 'B4') ? 'selected' : '' ?>>B4
                        <option <?= ($row['qualis'] == 'B3') ? 'selected' : '' ?>>B3
                        <option <?= ($row['qualis'] == 'B2') ? 'selected' : '' ?>>B2
                        <option <?= ($row['qualis'] == 'B1') ? 'selected' : '' ?>>B1
                        <option <?= ($row['qualis'] == 'A2') ? 'selected' : '' ?>>A2
                        <option <?= ($row['qualis'] == 'A1') ? 'selected' : '' ?>>A1
                    </select>
                </div>

                <div class="row">
                    <div class="input-field col s12">
                        <input type="text" class="validate" id="fonte" name='fonte' required
                               value='<?= stripslashes($row['fonte']) ?>'><label for="fonte">Onde esse valor de Qualis
                            foi obtido? (Ex.: site oficial, google, outros.)</label>
                    </div>
                </div>

                <?php if ($metadados) { ?>
                <div >
                    <div class="row">
                    <h5>Metadados
                        <a class="btn-floating btn-small waves-effect waves-light tooltipped blue"
                           data-position='bottom' data-delay='10'
                           data-tooltip='Clique para incluir um novo metadado'
                           id="botao-novo-metadado"
                        ><i class="material-icons">add</i></a>
                    </h5>
                    </div>
                    <div id="grupo-metadados" class="container">
                    </div>
                </div>
                <?php } else { ?>
                    <div class="row">
                        <h6>Salve este item para habilitar a edição de metadados.</h6>
                    </div>
                <?php } ?>

                <div class="row">
                    <input type='hidden' value='1' name='submitted'/>
                    <button class="btn waves-effect waves-light" type="submit" name="action"
                            id="btnSubmit"><?= $labelBotaoEnviar ?>
                        <i class="material-icons right">send</i>
                    </button>
                    <a class="btn waves-effect waves-light grey lighten-5" style='color: black'
                       href='qualis_list.php'><i class="material-icons right">undo</i>Voltar para listagem</a>
                </div>

                <input type="hidden" name='metadados' id="input-metadados">
            </form>
        </div>
    </div>

    <!--suppress JSValidateTypes, JSUnresolvedFunction -->
    <script>
        var GRUPO_METADADOS = $("#grupo-metadados");
        var INPUT_METADADOS = $("#input-metadados");

        var modeloLinha = '' +
'           <div class="row"> ' +
'                <div class="input-field col s10"> ' +
'                     <input type="text" class="validate" data-metadado="@nomeDoMetadadoQuoted#" id="meta-@nomeDoMetadadoQuoted#" required>' +
'                     <label for="meta-@nomeDoMetadadoQuoted#">@nomeDoMetadado#</label> ' +
'                </div> ' +
'                <div class="input-field col s2"> ' +
'                    <a class="btn-floating btn-small waves-effect waves-light tooltipped blue" data-position="bottom" data-delay="10" data-tooltip="Clique para excluir este metadado"' +
'                        onclick=\'return removerMetadado("@nomeDoMetadado#");\'> ' +
'                        <i class="material-icons">remove</i>' +
'                    </a> ' +
'                 </div> ' +
'            </div>';

        var metadadosJSON = "<?= addslashes($row['metadados']) ?>";
        if (metadadosJSON.trim() === '') {
            metadadosJSON = '{}';
        }

        var metadados = JSON.parse(metadadosJSON);

        function pintar() {
            GRUPO_METADADOS.empty();
            Object.keys(metadados).forEach(function (key, index) {
                var modeloComValores = modeloLinha.replace(/@nomeDoMetadadoQuoted#/g, key.replace(/"/g, '&quot;')).replace(/@nomeDoMetadado#/g, key)
                var novoGrupo = $(modeloComValores);
                novoGrupo.find("[data-metadado]").val(metadados[key]);
                novoGrupo.appendTo(GRUPO_METADADOS);
            });
            $("[data-metadado]").focus();
        }

        function removerMetadado(nomeDoMetadado) {
            delete metadados[nomeDoMetadado];
            pintar();
            return false;
        }

        $(document).on('keydown', "[data-metadado]", atualizarInputMetadados);
        function atualizarInputMetadados() {
            window.metadados = {};
            $("[data-metadado]").each(function () {
                metadados[$(this).data("metadado").replace(/&quot;/g, '"')] = $(this).val();
            });
            INPUT_METADADOS.val(JSON.stringify(window.metadados));
            console.log(JSON.stringify(window.metadados));
        }

        $("#botao-novo-metadado").click(function () {
            var nomeDoNovoMetadado = prompt("Qual o nome do novo metadado?");
            window.metadados[nomeDoNovoMetadado] = '';
            pintar();
        });

        $("#btnSubmit").click(atualizarInputMetadados);

        pintar();
        atualizarInputMetadados();
        $("#titulo").focus();
    </script>
    <script type="text/javascript">
        /* global $ */
        $(document).ready(function () {
            $('#qualis').material_select();
        });
    </script>
<?php
}
