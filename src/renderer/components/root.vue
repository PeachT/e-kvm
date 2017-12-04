<template>
  <div class="wh100 root">
    <el-container class="wh100">
      <el-header class="status-bar" height="32px">
        <span class="title">·{{$store.state.global.menuTitle}}·</span>
        <el-button class="btn-menu" type="primary" icon="el-icon-menu" @click="$store.commit('showMenu', !$store.state.global.showMenu)"></el-button>
      </el-header>
      <el-main>
        <home-menu class="root-menu" v-if="$store.state.global.showMenu" @click.native="$store.commit('showMenu', false)"></home-menu>
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import HomeMenu from './menus/menu.vue';
  export default {
    name: 'root',
    components: {
      HomeMenu,
    },
  };

</script>

<style lang="scss">
.root{
  header, main, footer{
    padding: 0;
    margin: 0;
  }
  .status-bar{
    line-height: 36px;
    background-color: black;
    .btn-menu{
      float: right;
    }
    .title{
      color: white;
      font-size: 26px;
    }
  }
  main{
    position: relative;
    .root-menu{
      position: absolute;
      top:0;
      left:0;
      z-index: 99999999999;
    }
  }
}
</style>
