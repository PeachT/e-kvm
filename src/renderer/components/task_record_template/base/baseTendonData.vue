<template>
  <div class="wh100">
    <!--  -->
    <el-form label-width="85px">
      <div class="row-flex">
        <el-form-item label="控制应力">
          <el-input value="123456"></el-input>
        </el-form-item>
        <el-form-item label="张拉长度">
          <el-input >
            <i slot="suffix" class="el-input__icon">m</i>
          </el-input>
        </el-form-item>
        <el-form-item label="钢绞线数量">
          <el-input value="123456"></el-input>
        </el-form-item>
        <el-form-item label="张拉工艺">
          <el-select v-model="value" placeholder="请选择" style="width:100%;">
            <el-option v-for="(item, index) in ['3段', '4段', '5段']" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备/孔号" style="flex: 2;">
          <div class="row-flex">
            <el-input value="123456"></el-input>
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">A组</i>
            </el-input>
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">B组</i>
            </el-input>
          </div>
        </el-form-item>
        <div class="el-radio-group" style="display: flex; justify-content: center;">
          <el-radio label="1" border>二次张拉</el-radio>
          <el-radio label="2" border>超张拉</el-radio>
        </div>
      </div>
    <!-- 张拉数据 -->
      <table class="tendon-item" width="100%">
        <tr>
          <th width="80px">张拉数据</th>
          <th v-for="(item, index) in ['初张拉','阶段一','阶段二','阶段三','终张拉','超张拉']" :key="index">{{item}}</th>
          <th width="120px">工作长度</th>
          <th width="120px">内缩量均值</th>
          <th width="120px">理论伸长量</th>
        </tr>
        <tr>
          <td>张拉阶段</td>
          <td v-for="(item, index) in 6" :key="index">
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">%</i>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>控制应力</td>
          <td v-for="(item, index) in 6" :key="index">
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">kn</i>
            </el-input>
          </td>
        </tr>
        <tr :class="item" v-for="(item, index) in ['A1','A2','B1','B2']" :key="index">
          <td>{{item}}</td>
          <td v-for="(item, index) in 6" :key="index">
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
          </td>
          <!-- 工作长度 -->
          <td>
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 内缩量均值 -->
          <td>
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 理论生长量 -->
          <td rowspan="2" class="h" v-if="index===0 || index===2">
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>持荷时间</td>
          <td v-for="(item, index) in 6" :key="index">
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">s</i>
            </el-input>
          </td>
        </tr>
      </table>
    </el-form>
    <!--  -->
  </div>
</template>

<script>
  export default {
    name: 'main',
    data: () => ({
      ccc: 0,
      value: '',
    }),
  };

</script>

<style lang="scss">
  .tendon-item{
    .h{
      .el-input--small .el-input__inner{
        height: 66px;
      }
    }
    td{
      text-align: center;
    }
  }
</style>
