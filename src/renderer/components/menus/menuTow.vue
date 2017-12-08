<template>
  <div class="wh100 menu-template">
    <el-container class="wh100">
      <el-header height="40px" class="teak-header">
        <el-button-group >
          <el-button type="success" @click="emit('add')">添加</el-button>
          <el-button type="primary" @click="emit('edit')" :disabled="!activeItem">编辑</el-button>
          <el-button type="primary" @click="emit('down')" :disabled="!activeItem">下载</el-button>
          <el-button type="danger" @click="emit('dle')" :disabled="!activeItem">删除</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <div class="items">
            <li class="item" :class="{'active' : activeItem === index}" v-for="(item, index) in menuData" :key="index" @click.stop="activeItemFunc(index, item.id)">
              <!-- <i class="el-icon-delete"></i> -->
              <span>
                {{item.name}}
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
  props: ['menuData'],
  data: () => ({
    active: null,
    activeItem: null,
  }),
  methods: {
    activeItemFunc(index, id) {
      const state = this.activeItem === index;
      if (!state) {
        this.activeItem = state === index ? null : index;
        this.$message(`${index}`);
        this.emit('update:nowId', id);
      }
    },
    emit(state) {
      this.$emit('operation', state);
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
