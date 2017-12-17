<template>
  <div class="wh100 menu">
    <img class="bgk-img" :src="bgkimg" alt="">
    <div class="items">
      <div class="item" v-for="(item, index) in menus" :key="index" @click="$router.push(item.path)">
        <svg aria-hidden="true">
          <use :xlink:href="`#${item.icon}`"></use>
        </svg>
        {{item.name}}
        <div class="bgk"></div>
      </div>
    </div>
    <div class="operator">
      <el-button @click.stop="dialogState = true" icon="el-icon-more"></el-button>
    </div>

    <el-dialog
      :visible.sync="dialogState"
      width="50%"
      >
      <div>
        <div class="dialog">
          <el-button class="button-radius" type="primary" @click.stop="dialogOperationFunc(1)" v-if="dialogOperation===0 || dialogOperation ===1">登陆</el-button>
          <el-button class="button-radius" type="warning" @click.stop="dialogOperationFunc(2)"  v-if="dialogOperation===0 || dialogOperation ===2">重启</el-button>
          <el-button class="button-radius" type="danger"  @click.stop="dialogOperationFunc(3)" v-if="dialogOperation===0 || dialogOperation ===3">关机</el-button>
        </div>
        <p style="text-align:center;" v-show="dialogOperation > 0">点击{{['登陆', '重启', '关机'][(dialogOperation-1)]}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'menu',
    components: { },
    watch: {
      dialogState(nval) {
        if (!nval) {
          this.dialogOperation = 0;
        }
      },
    },
    data: () => ({
      dialogState: false,
      dialogOperation: 0,
      bgkimg: 'file:///E:/KVM/UIImg/home-backage1.png',
      menus: [
        { name: '任务', path: '/task', icon: 'icon-bianji', permissions: 0 },
        { name: '记录', path: '/record', icon: 'icon-bianji', permissions: 0 },
        { name: '构件', path: '/girder', icon: 'icon-bianji', permissions: 0 },
        { name: '用户', path: '/user', icon: 'icon-bianji', permissions: 1 },
        { name: '设备', path: '/device', icon: 'icon-bianji', permissions: 0 },
        { name: '监控', path: '/monitoring', icon: 'icon-bianji', permissions: 0 },
        { name: '操作员', path: '/operator', icon: 'icon-bianji', permissions: 0 },
        { name: '钢绞线', path: '/steelStrand', icon: 'icon-bianji', permissions: 0 },
        { name: '模板', path: '/tpl', icon: 'icon-bianji', permissions: 1 },
      ],
    }),
    methods: {
      dialogOperationFunc(operation) {
        if (this.dialogOperation > 0) {
          switch (operation) {
            case 1:
              this.$router.push('/');
              break;
            case 2:
              this.$router.push('/');
              break;
            case 3:
              this.$router.push('/');
              break;
            default:
              break;
          }
        }
        this.dialogOperation = operation;
      },
    },
  };
</script>

<style lang="scss">
.menu{
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  // background-image: url()
  .items{
    width: 783px;
    border-bottom: 1px solid #EDF2FC;
    border-right: 1px solid #EDF2FC;
    z-index: 3;
    .item{
      position: relative;
      float: left;
      height: 260px;
      width: 260px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 36px;
      border: 0;
      border-top: 1px;
      border-left: 1px;
      border-color: #EDF2FC;
      border-style: solid;
      color: white;
      .bgk{
        position: absolute;
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 100%;
        top:0;
        left: 0;
        z-index: -1;
        // filter: blur(15px);
      }
    }
  }
  .button-radius{
    button{
      height: 96px;
      width: 96px;
      border-radius: 48px;
      font-size: 30px;
      border:0;
      transition: 10s;
    }
  }
  .operator{
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 3;
    @extend .button-radius;
  }

  .bgk-img{
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 2;
    // filter: blur(15px);
  }
  .dialog{
    display: flex;
    justify-content: space-around;
    @extend .button-radius;
  }
}
</style>

