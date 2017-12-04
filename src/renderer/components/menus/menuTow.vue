<template>
  <div class="wh100 menu-template">
    <el-container class="wh100">
      <el-header height="40px" class="teak-header">
        <el-button-group >
          <el-button type="success" >添加</el-button>
          <el-button type="primary" >编辑</el-button>
          <el-button type="primary" >下载</el-button>
          <el-button type="danger" >删除</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <div class="items">
            <li class="item" :class="{'active' : activeItem === index}" v-for="(item, index) in 50" :key="index" @click.stop="activeItemFunc(index)">
              <i class="el-icon-delete"></i>
              <span>
                {{'123456kkkl'+item}}
                {{'123456kkkl'+item}}
              </span>
            </li>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'taskmenu',
  data: () => ({
    active: null,
    activeItem: null,
  }),
  methods: {
    activeItemFunc(index) {
      const state = this.activeItem === index;
      if (!state) {
        this.activeItem = state === index ? null : index;
        this.$message(`${this.active}--${index}`);
      }
    },
  },
};
</script>
<style scoped>

</style>

<style lang="scss" scoped>
.items{
      // height: 0;
      // transition: height .3s ease-in-out,padding-top .3s ease-in-out,padding-bottom .3s ease-in-out;
      // overflow: hidden;
  overflow-y: auto;
  height: 100%;
  .item{
    padding: 15px 10px 10px;
    font-size: 22px;
    display: flex;
    align-items: center;
    border-bottom:1px solid #EDF2FC;
    &.active{
      background-color: #EDF2FC;
    }
    i{
      margin-right: 5px;
    }
  }
}
</style>
