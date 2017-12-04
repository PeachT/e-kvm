<template>
  <div class="wh100">
    <el-form label-width="85">
      <h3>钢绞线信息</h3>
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
    <el-form label-width="85">
      <h3>混泥土信息</h3>
      <div class="row-flex">
        <el-form-item :label="item[1]"
          v-for="(item, index) in [['skqd', '试块强度'],['sjqd', '设计强度'],['zlqd', '张拉强度']]"
          :key="index">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="浇筑日期">
          <el-date-picker style="width:100%;" type="date" placeholder="选择日期" ></el-date-picker>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

