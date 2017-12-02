<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  const { mapState } = require('vuex');
  export default {
    name: 'electronTemplate',
    computed: {
      ...mapState({ path: state => state.global.path }),
    },
    watch: {
    },
    methods: {
    },
  };
</script>

<style lang="scss">
@import "./css/elementUI.scss";
@import "./css/global.scss";
// 路由切换过度动画
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
</style>
