<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  const { mapState } = require('vuex');
  const { ipcRenderer } = require('electron');
  const plc1 = require('electron').remote.getGlobal('plc1');
  const plc2 = require('electron').remote.getGlobal('plc2');
  ipcRenderer.on('modbus', (event, arg) => {
    if (arg.id === 1) {
      console.log(arg, plc1, plc2); // prints "pong"
      ipcRenderer.send('write1', { address: 1280, data: true });
    } else {
      ipcRenderer.send('write2', { address: 1280, data: true });
    }
  });
  ipcRenderer.on('msg', (event, arg) => {
    console.log(arg); // prints "pong"
  });
  export default {
    name: 'electronTemplate',
    computed: {
      // ...mapState({ path: state => state.global.path }),
    },
    beforeMount() {
      ipcRenderer.send('RendererShow');
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
@import "./css/menuTemplate.scss";
@import "./css/deviceInfo.scss";
// @import "./css/task_record.scss";
// 路由切换过度动画
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
  opacity: 0
}
</style>
