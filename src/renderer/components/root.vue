<template>
  <div class="wh100 root">
    <el-container class="wh100">
      <el-header class="status-bar" height="32px">
        <span class="title">·{{$store.state.global.menuTitle}}·</span>
        <el-button class="btn-menu" type="primary" icon="el-icon-menu" @click="switchMenuFunc()"></el-button>
        <el-button-group class="btn-menu PLC">
            <el-button :class="{'on': PLCState1}" :icon="PLCState1 ? 'el-icon-success' : 'el-icon-warning'">主站</el-button>
            <el-button :class="{'on': PLCState2}" :icon="PLCState2 ? 'el-icon-success' : 'el-icon-warning'">从站</el-button>
        </el-button-group>
        <el-button-group class="btn-menu PLC">
            <el-button @click="errorState = true" type="error" v-show="currentlyS">报警</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <home-menu class="root-menu" :class="{'active': !showMenu}" ref="menu" v-if="showMenu2"  @click.native="$store.commit('showMenu', false)"></home-menu>
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
    <error :errorState.sync="errorState" />
  </div>
</template>

<script>
  import HomeMenu from './menus/menu.vue';
  import Error from './error/error.vue';
  const returnData16 = require('../modbus-tcp/returnData').default.returnData16;
  const { ipcRenderer } = require('electron');

  export default {
    name: 'root',
    components: {
      HomeMenu,
      Error,
    },
    beforeMount() {
      if (window.manual.getAll[0].id) {
        window.deviceId = window.manual.getAll[0].id;
      } else if (window.deviceDB.getAll[0]) {
        window.deviceId = window.deviceDB.getAll[0].id;
      }
      if (this.PLCState1) {
        this.plcFunc(1);
      } else if (this.PLCState2) {
        this.plcFunc(2);
      }
    },
    data() {
      return {
        showMenu2: false,
        errorState: false,
      };
    },
    computed: {
      PLCState1() {
        return this.$store.state.global.PLC1State;
      },
      PLCState2() {
        return this.$store.state.global.PLC2State;
      },
      showMenu() {
        return this.$store.state.global.showMenu;
      },
      editState() {
        return this.$store.state.global.editState || this.$store.state.global.addState;
      },
      currentlyS() {
        const p1 = this.$store.state.global.PLC1S;
        const p2 = this.$store.state.global.PLC2S;
        let p1s = false;
        let p2s = false;
        if (this.PLCState1 && p1) {
          p1s = p1.indexOf('1') > -1;
        }
        if (this.PLCState2 && p2) {
          p2s = p2.indexOf('1') > -1;
        }
        return p1s || p2s;
      },
      systen() {
        return this.$store.state.global.systen.WorkCeilingMM;
      },
    },
    watch: {
      showMenu(nval) {
        if (!nval) {
          setTimeout(() => {
            if (!this.showMenu) {
              this.showMenu2 = false;
            }
          }, 1000);
        }
        this.showMenu2 = true;
      },
      PLCState1(nval) {
        if (nval) {
          this.plcFunc(1);
        }
      },
      PLCState2(nval) {
        if (nval && !this.PLCState1) {
          this.plcFunc(2);
        }
      },
    },
    methods: {
      switchMenuFunc() {
        if (!this.editState) {
          this.$store.commit('showMenu', !this.showMenu);
        } else {
          this.$message.error('请先完成编辑操作！');
        }
      },
      plcFunc(id) {
        const func = id === 1 ? 'rPLC1' : 'rPLC2';
        ipcRenderer.send(func, { func: 'readRegisters16', address: 4596, data: 20, callback: 'systen' });
        ipcRenderer.on('systen', (event, data) => {
          // const plc = data.id === 1 ? 'z' : 'c';
          const datas = returnData16(data.callbackData);
          const systen = {
            WorkCeilingMM: datas[12],
          };
          this.$store.dispatch('systen', systen);
          // this.plc[plc] = {
          //   ceilingMpa: datas[0], // 上限
          //   differencePressure: datas[1], // 下限
          //   superSetPressure: datas[2], // 超设置压力
          //   returnPressure: datas[3], // 回程压力
          //   delay: datas[4], // 油泵延时s
          //   replenish: datas[5], // 补压压力%
          //   ceilingMM: datas[10], // 位移上限
          //   lowerMM: datas[11], // 位移下限
          //   WorkCeilingMM: datas[12], // 位移工作上限
          //   WorkLowerMM: datas[13], // 位移工作下限
          // };
        });
      },
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
      z-index: 99999999999 !important;
      &.active{
        animation: hhh 1s;
        animation-fill-mode: forwards;
      }
    }
  }
}
@keyframes hhh {
  form { opacity: 1; }
  to { opacity: 0; }
}
@keyframes hhh2 {
  form { opacity: 1; }
  to { opacity: .5; }
}
.PLC{
  .el-button{
    .el-icon-success{
      color: #F56C6C;
    }
    background-color: #DCDFE6;
  }
  .on{
    .el-icon-success{
      animation: 1s rainbow infinite alternate;
      color: #67C23A;
    }
    color: #67C23A;
    background-color: white;
  }
}
@keyframes rainbow {
  // 0% { background: #c00; }
  // 50% { background: orange; }
  // 100% { background: yellowgreen; }
  0% { opacity: 1 }
  to { opacity: .3 }
}
</style>
