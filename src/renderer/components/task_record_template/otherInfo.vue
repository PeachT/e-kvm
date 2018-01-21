<template>
  <div class="wh100">
    <h3>钢绞线信息</h3>
    <el-table :data="[nowData]" style="width: 100%" border>
      <el-table-column prop="specs" label="钢绞线规格" ></el-table-column>
      <el-table-column prop="elasticityModulus" label="弹性模量" ></el-table-column>
      <el-table-column prop="prestress" label="控制应力KN" ></el-table-column>
      <el-table-column prop="reportNumber" label="报告编号" ></el-table-column>
      <el-table-column prop="demarcationDate" label="标定日期" ></el-table-column>
    </el-table>
    <hr>
    <el-form label-width="85">
      <h3>混泥土信息</h3>
      <div class="row-flex">
        <el-form-item :label="item[1]"
          v-for="(item, index) in [['sampleNumber', '试块编号'], ['sampleStrength', '试块强度'], ['designStrength', '设计强度'],['tensioningStrengthNow','张拉时砼强度']]"
          :key="index">
          <el-input v-model="concretes[item[0]]"></el-input>
        </el-form-item>
        <el-form-item label="浇筑日期">
          <el-date-picker style="width:100%;" type="date" placeholder="选择日期"
            :editable="false"
            align="center"
            value-format="yyyy-MM-dd"
            v-model="concretes.castingDate"></el-date-picker>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'otherInfo',
  props: ['steelStrandId', 'concretes'],
  computed: {
    nowData() {
      return window.steelStrandsDB.getOne({ id: this.steelStrandId });
    },
  },
};
</script>
