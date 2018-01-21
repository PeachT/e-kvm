<template>
  <div class="wh100 menu">
    <img class="bgk-img" :src="bgkimg" alt="">
    <div class="items">
      <div class="item" :class="{'active': item.path === $route.path}" v-for="(item, index) in menus" :key="index" @click="$router.push(item.path)">
        <svg aria-hidden="true" width="100%">
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
  const menus = [
    // { name: '任务', path: '/task', icon: 'icon-bianji', permissions: 0 },
    { name: '构件', path: '/girder', icon: '', permissions: 0 },
    { name: '钢绞线', path: '/steelStrand', icon: '', permissions: 1 },
    { name: '千斤顶', path: '/device', icon: '', permissions: 1 },
    { name: '系统参数', path: '/system', icon: '', permissions: 1 },
    { name: '项目', path: '/user', icon: '', permissions: 1 },
    { name: '操作员', path: '/operator', icon: '', permissions: 1 },
    { name: '无', path: '/', icon: '', permissions: 0 },
    { name: '无', path: '/', icon: '', permissions: 0 },
    { name: '无', path: '/', icon: '', permissions: 0 },
    { name: '无', path: '/', icon: '', permissions: 0 },
    { name: '手动', path: '/manual', icon: '', permissions: 0 },
    { name: '测试', path: '/d0', icon: '', permissions: 0 },
    { name: '监控', path: '/monitoring', icon: '', permissions: 0 },
    { name: '记录', path: '/', icon: '', permissions: 0 },
  ];
  export default {
    name: 'menu',
    components: { },
    beforeMount() {
      console.log(this.$route.path);
    },
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
    }),
    computed: {
      menus() {
        const arr = [];
        let permissions = 0;
        if (this.$store.state.global.user) {
          arr.push(
            { name: '任务', path: '/task', icon: 'icon-bianji', permissions: 0 });
        }
        if (this.$store.state.global.operator) {
          permissions = this.$store.state.global.operator.permissions;
        }
        arr.push(...menus.filter(
          item => item.permissions <= permissions));
        return arr;
      },
    },
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

<style lang="scss" scoped>
.menu{
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  // background-image: url()
  background-color: rgba(0, 0, 0, 0.5);
  .items{
    width: 75%;
    height: 90%;
    z-index: 3;
    box-shadow: -1px -1px 1px 0 #ccc;
    .item{
      opacity: .7;
      position: relative;
      float: left;
      height: 25%;
      width: 25%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 36px;
      color: white;
      box-shadow: 1px 1px 1px 0 #ccc;
      .bgk{
        position: absolute;
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: 100%;
        top:0;
        left: 0;
        z-index: -1;
      }
      &.active{
        animation: fadein ease-in .5s;
        animation-fill-mode: forwards;
        // box-shadow: 3px 3px 6px #fff;
        box-shadow: 5px 5px 6px #fff;
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

