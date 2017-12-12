<template>
  <div class="wh100 menu-template">
    <el-container class="wh100">
      <el-header height="40px" class="teak-header">
        <el-button-group v-if="!edit">
          <el-button type="success" @click="$store.commit('editState', true), $store.commit('addState', true), $emit('add')">添加</el-button>
          <el-button type="primary" @click="$store.commit('editState', true), $emit('edit')" :disabled="!nowName">编辑</el-button>
          <el-button type="primary" @click="$emit('down')" :disabled="!nowName">下载</el-button>
          <el-button type="danger" @click="$emit('del')" :disabled="!nowName">删除</el-button>
        </el-button-group>
        <el-button-group v-if="edit">
          <el-button type="success" @click="$emit('save')">保存</el-button>
          <el-button type="danger" @click=" $emit('cancel')">取消</el-button>
        </el-button-group>

      </el-header>
      <el-main>
        <div class="items">
            <li class="item" :class="{'active' : item.name === nowName}" v-for="(item, index) in menuData" :key="index" @click.stop="activeItemFunc(index, item.name)">
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
  props: ['menuData', 'nowName'],
  computed: {
    edit() {
      return this.$store.state.global.editState;
    },
  },
  data: () => ({
    active: null,
    activeItem: null,
  }),
  methods: {
    activeItemFunc(index, name) {
      const state = this.nowName === name;
      if (!state) {
        if (this.$store.state.global.editState) {
          this.$message('请完成编辑操作才能切换！');
        } else {
          this.$message(`${name}`);
          this.$emit('update:nowName', name);
        }
        // this.$emit('update:foo', newValue)
      }
    },
    emit(state) {
      this.$emit(state);
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
