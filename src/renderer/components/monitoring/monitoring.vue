<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-header height="40px">
        <router-link to="/menu">菜单</router-link>
      </el-header>
      <el-main>
        <div>
          <steps></steps>

          <table width="100%" border="1" cellspacing="0">
            <tr>
              <th>设备</th>
              <th>状态</th>
              <th>顶位移</th>
              <th>设备压力</th>
              <th>目标压力</th>
              <th>单顶伸长量</th>
              <th>组伸长量</th>
              <th>组偏差率</th>
              <th>理论伸长量</th>
              <th>总伸长量</th>
              <th>总偏差率</th>
            </tr>
            <tr :class="item" v-for="(item, index) in ['A1', 'A2', 'B1', 'B2']" :key="index">
              <td>{{item}}</td>
              <td>状态</td>
              <td>顶位移</td>
              <td>设备压力</td>
              <td>目标压力</td>
              <td>单顶伸长量</td>
              <td>组伸长量</td>
              <td>组偏差率</td>
              <td>理论伸长量</td>
              <td>总伸长量</td>
              <td>总偏差率</td>
            </tr>
          </table>
        </div>
        <div style="display: flex;">
          <veline style="flex:1;" title="压力曲线" max="60"></veline>
          <veline style="flex:1;" title="压力曲线" max="220"></veline>
        </div>
      </el-main>
      <el-footer height="40px">Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import Veline from '../task_record_template/base/veline';
import Steps from './steps/steps';
export default {
  name: 'monitoring',
  components: {
    Veline,
    Steps,
  },
  data: () => ({
    mpas: [2, 3, 4, 5, 8, 10],
  }),
};
</script>

<style lang="scss" scoped>
@import '../../css/variable.scss';

table{
  text-align: center;
  border: 0;
  th{
    border: 1px solid #CCC;
    font-size: 25px;
  }
  td{
    border: 1px solid #CCC;
    font-size: 25px;
    padding: 2px 5px;
  }
}
</style>
