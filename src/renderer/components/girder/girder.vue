<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-aside class="task-menu" width="224px">
        <menu-two :menuData="menuData" :nowId.sync="nowId" @operation="operation" ></menu-two>
      </el-aside>
      <el-main class="task-main">
        <girder-info></girder-info>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import girderInfo from './template/girderInfo';
import MenuTwo from '../menus/menuTow';

export default {
  name: 'girder',
  components: {
    MenuTwo, girderInfo,
  },
  computed: {
    menuData() {
      return [];
    },
    nowData() {
      return null;
    },
  },
  data: () => ({
    nowId: '',
  }),
  methods: {
    operation(state) {
      this.$message(state);
    },
  },
};
</script>
