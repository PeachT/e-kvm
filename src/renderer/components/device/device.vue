<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-aside class="task-menu" width="224px">
        <menu-two @operation="operation"></menu-two>
      </el-aside>
      <el-main class="task-main">
        <device-info></device-info>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import DeviceInfo from './template/deviceInfo';
import MenuTwo from '../menus/menuTow';

export default {
  name: 'devide',
  components: {
    DeviceInfo, MenuTwo,
  },
  methods: {
    operation(state) {
      this.$message(state);
    },
  },
};
</script>
