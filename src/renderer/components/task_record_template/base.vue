<template>
  <div class="wh100">
    <!--  -->
    <el-form class="form-info" label-width="80px">
      <div class="text-info">
        <div class="row-flex">
          <el-form-item label="构件名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="构件/孔号">
            <div class="row-flex">
              <el-input>
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
              <el-input>
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="设 备">
            <div class="row-flex">
              <el-input>
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
              <el-button>分组</el-button>
            </div>
          </el-form-item>
        </div>
        <div class="row-flex">
          <el-form-item label="梁 号">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="钢绞线">
            <div class="row-flex">
              <el-input>
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </div>
        <div class="row-flex">
          <el-form-item label="浇筑日期">
            <el-date-picker style="width:100%;" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="张拉强度">
            <el-input>
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </div>
      </div>
      <div class="img-info">
        <img src="" alt="没有图片">
      </div>
    </el-form>
    <!-- 张拉分组 -->
    <el-radio-group class="zl-group">
      <el-radio-button :label="`上海${index}`" v-for="(item, index) in 50" :key="index"></el-radio-button>
    </el-radio-group>
    <!--  -->
    <el-form label-width="85px">
      <div class="row-flex">
        <el-form-item label="控制应力">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="钢绞线数量">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="张拉工艺">
          <el-select v-model="value" placeholder="请选择" style="width:100%;">
            <el-option v-for="(item, index) in ['3段', '4段', '5段']" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备/孔号" style="flex: 1.5;">
          <div class="row-flex">
            <el-input></el-input>
            <el-input>
              <i slot="prefix" class="el-input__icon">A组</i>
            </el-input>
            <el-input>
              <i slot="prefix" class="el-input__icon">B组</i>
            </el-input>
          </div>
        </el-form-item>
        <div class="el-radio-group" style="display: flex; justify-content: center;">
          <el-radio label="1" border>二次张拉</el-radio>
          <el-radio label="2" border>超张拉</el-radio>
        </div>
      </div>
    </el-form>
    <!-- 张拉数据 -->
    <el-form>
      <table class="zl-item" width="100%">
        <tr>
          <th width="80px">张拉数据</th>
          <th v-for="(item, index) in ['初张拉','阶段一','阶段二','阶段三','终张拉','超张拉']" :key="index">{{item}}</th>
          <th width="100px">工作长度</th>
          <th width="100px">理论伸长量</th>
        </tr>
        <tr>
          <td>控制应力</td>
          <td v-for="(item, index) in 6" :key="index">
            <el-input>
              <i slot="suffix" class="el-input__icon">kn</i>
            </el-input>
          </td>
        </tr>
        <tr v-for="(item, index) in ['A1','A2','B1','B2']" :key="index">
          <td>{{item}}</td>
          <td v-for="(item, index) in 6" :key="index">
            <el-input>
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
          </td>
          <!-- 工作长度 -->
          <td>
            <el-input>
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 理论生长量 -->
          <td rowspan="2" class="h" v-if="index===0 || index===2">
            <el-input>
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>持荷时间</td>
          <td v-for="(item, index) in 6" :key="index">
            <el-input>
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
  
  .form-info{
    display: flex;
    .text-info{
      flex: auto;
    }
    .img-info{
      width: 210px;
      margin: 0 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .zl-group{
    padding: 5px 0px;
    margin-bottom: 15px;
    overflow-x: auto;
    display: flex;
    background-color: #EDF2FC;
  }
  .zl-item{
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
