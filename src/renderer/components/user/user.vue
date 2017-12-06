<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-aside class="task-menu" width="224px">
        <menu-two @operation="operation"></menu-two>
      </el-aside>
      <el-main class="task-main">
        <user-info></user-info>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import UserInfo from './template/userInfo';
import MenuTwo from '../menus/menuTow';

export default {
  name: 'devide',
  components: {
    MenuTwo, UserInfo,
  },
  methods: {
    operation(state) {
      this.$message(state);
    },
  },
};
</script>
