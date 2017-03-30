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
        <div class="layout-col_right">Second Column</div>
    </div>
</template>

<style>
@import "variables.css";

.layout-container {
    display: block;
    position:absolute;
    height:auto;
    bottom:0;
    top:0;
    left:0;
    right:0;
    background-color: lightgray;
}
.layout-col_left {
    background-color: #f4f4f4;
    width:417px;
    position:absolute;
    left:0;top:0;
    bottom:0;
    height:auto;
    display: block;
    overflow-y: scroll;
}
.layout-col_right {
    margin-left:417px;
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
