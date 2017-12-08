<template>
  <div class="wh100 stell-strand-info">
    <el-form label-width="85">
      <div class="row-flex">
        <el-form-item :label="item[1]"
          v-for="(item, index) in [['gjxgg','钢绞线规格'],['txml', '弹性模量'],['kzyl', '控制应力KN'],['bgbh', '报告编号']]"
          :key="index">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="标定日期">
          <el-date-picker style="width:100%;" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </div>
    </el-form>
  </div>
    <!-- <div ref="aaa">
      <input type="number" v-model="height">
    </div> -->
</template>

<script>
// const d3 = require('../../../js/d3/d3');
// import * as d3 from 'd3';
export default {
  name: 'steelStrandInfo',
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.stell-strand-info{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

