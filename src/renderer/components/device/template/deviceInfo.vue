<template>
  <div class="wh100 device-info" >
    <el-form label-width="100px" >
      <div class="row-flex">
        <el-form-item label="设备名称">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="千斤顶型号">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="油泵型号">
          <el-input ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="张拉模式" style="flex:2;">
        <el-checkbox-group >
          <el-checkbox :label="index" border v-for="(item, index) in ['A1单顶', 'A两顶', 'B1单顶', 'B两顶', '四顶']" :key="index">{{item}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="回归方程">
        <el-radio-group >
          <el-radio :label="true" border>F=aP+b F张拉控制应力KN</el-radio>
          <el-radio :label="false" border>P=aF+b P张拉控制应力MPa</el-radio>
        </el-radio-group>
      </el-form-item>


      <!-- 详细信息 -->
      <div class="gloup">
        <div :class="item" v-for="(item, index) in ['A1', 'A2', 'B1', 'B2']" :key="index">
          <h3 :class="item" style="background-color: rgb(245, 247, 250);">{{item}}泵顶数据</h3>

          <div class="row-flex">
            <el-form-item label="千斤顶编号">
              <el-input ></el-input>
            </el-form-item>
            <el-form-item label="油泵编号">
              <el-input value="123456"></el-input>
            </el-form-item>
            <el-form-item label="油泵编号">
              <el-input value="123456"></el-input>
            </el-form-item>
          </div>

          <div class="row-flex">
            <el-form-item :label="`回归方程: ${true ? 'F=': 'P='}`">
              <el-input  type="number" ></el-input>
            </el-form-item>
            <el-form-item :label="true ? 'P+': 'F+'" class="fc">
              <el-input  type="number"></el-input>
            </el-form-item>
            <el-form-item label="标定日期">
              <el-date-picker style="width: auto;" type="date" placeholder="选择日期" :editable="false"></el-date-picker>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'deviceInfo',
    data: () => ({}),
  };

</script>

<style lang="scss" scoped>
.gloup{
  display: grid;
  grid-template-columns: 50% 50%;
  &>div{
    margin-right: 15px;
  }
}
</style>

