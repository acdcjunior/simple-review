<template>
    <div class="layout-container">
        <div class="layout-col_left">
            <router-view
                  class="view"
                  keep-alive
                  transition
                  transition-mode="out-in">
            </router-view>
        </div>
        <div class="layout-col_right">
            <iframe id="diff" name="diff" width="100%" height="99.635%" frameborder="0" marginheight="0" marginwidth="0" scrolling="yes" src=""></iframe>
            <div class="iframe-loading-over">
                <div style="margin-top: 10%; text-align: center">
                    <img id="iframe-loading-image" src="https://www.prizerebel.com/assets/images/progress_bar.gif" alt="Loading...">
                </div>
            </div>
        </div>
        <button id="botao-encolher" class="btn btn-default"
                title="Encolher (ocultar) temporariamente barra lateral"
        style="
            position: absolute;
            bottom: 1%;
            left: 1%;
            width: 40px;
            height:40px;
            z-index: 99999;
        "
        onclick="window.$('.layout-col_left').hide(); window.$('.layout-col_right').css('margin-left', '0'); window.$('#botao-encolher').hide(); window.$('#botao-expandir').show();"
        ><span class="glyphicon glyphicon-menu-left"></span></button>
        <button id="botao-expandir" class="btn btn-success"
                title="Retornar (expandir) barra lateral"
        style="
            display: none;

            position: absolute;
            bottom: 1%;
            left: 1%;
            width: 40px;
            height:40px;
            z-index: 99999;
        "
        onclick="window.$('.layout-col_left').show(); window.$('.layout-col_right').css('margin-left', '22.5%'); window.$('#botao-encolher').show(); window.$('#botao-expandir').hide();"
        ><span class="glyphicon glyphicon-menu-right"></span></button>
    </div>
</template>

<style>
@import "variables.css";

#botao-encolher, #botao-expandir {
    opacity: 0.6;
}
#botao-encolher:hover, #botao-expandir:hover {
    opacity: 1;
}

.layout-container {
    display: block;
    position:absolute;
    height:auto;
    bottom:0;
    top:0;
    left:0;
    right:0;
    background-color: white;
}
.layout-col_left {
    background-color: #f4f4f4;
    width:22.5%;
    position:absolute;
    left:0;top:0;
    bottom:0;
    height:auto;
    display: block;
    overflow-y: scroll;
}
.layout-col_right {
    margin-left:22.5%;
    height: 99.9%;
    position: relative;
}
.iframe-loading-over {
    position: absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: white;
    opacity: .99;
}

.glyphicon {
    margin-right: 6px;
}

.navbar {
  position: relative;
  min-height: 50px;
  margin-bottom: 20px;
  border: 1px solid transparent;
}

.navbar-default {
  background-color: #fff;
  border-width: 0;
}

.navbar-form {
  margin-top: 0;
  margin-bottom: 0;
}

.navbar-form .input-group > .form-control {
  background-color: #fff;
  border-width: 0;
  min-height: 50px;
  border-radius: 0;
}
</style>
