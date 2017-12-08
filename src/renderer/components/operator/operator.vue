<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-aside style="border-right:1px solid #EDF2FC;" width="224px">
        <menu-two :menuData="menuData" :nowId.sync="nowId" @operation="operation"></menu-two>
      </el-aside>
      <el-main class="task-main">
        <operator-info></operator-info>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import OperatorInfo from './template/operatorInfo';
import MenuTwo from '../menus/menuTow';

export default {
  name: 'devide',
  components: {
    MenuTwo, OperatorInfo,
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
