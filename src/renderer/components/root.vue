<template>
  <div class="wh100 root">
    <el-container class="wh100">
      <el-header class="status-bar" height="32px">
        <span class="title">·{{$store.state.global.menuTitle}}·</span>
        <el-button class="btn-menu" type="primary" icon="el-icon-menu" @click="switchMenuFunc()"></el-button>
        <el-button-group class="btn-menu PLC">
            <el-button :class="{'on': PLCState1}" :icon="PLCState1 ? 'el-icon-success' : 'el-icon-warning'">从站</el-button>
            <el-button :class="{'on': PLCState2}" :icon="PLCState2 ? 'el-icon-success' : 'el-icon-warning'">主站</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <home-menu class="root-menu" :class="{'active': !showMenu}" ref="menu" v-if="showMenu2"  @click.native="$store.commit('showMenu', false)"></home-menu>
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
    data() {
      return {
        showMenu2: false,
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
      // addState() {
      //   return
      // },
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
    },
    methods: {
      switchMenuFunc() {
        console.log(this.$store.state.global.editState || this.$store.state.global.addState,
          this.$store.state.global.editState,
          this.$store.state.global.addState);
        if (!this.editState) {
          this.$store.commit('showMenu', !this.showMenu);
        } else {
          this.$message.error('请先完成编辑操作！');
        }
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
