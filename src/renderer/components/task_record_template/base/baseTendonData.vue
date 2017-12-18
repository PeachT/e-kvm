<template>
  <div class="wh100">
    <!--  -->
    <el-form label-width="85px">
      <div class="row-flex">
        <el-form-item label="控制应力">
          <el-input v-model="taskData.tensioningKN"></el-input>
        </el-form-item>
        <el-form-item label="张拉长度">
          <el-input v-model="taskData.length">
            <i slot="suffix" class="el-input__icon">m</i>
          </el-input>
        </el-form-item>
        <el-form-item label="钢绞线数量">
          <el-input v-model="taskData.steelStrandNumber"></el-input>
        </el-form-item>
        <el-form-item label="张拉工艺">
          <el-select v-model="taskData.stage" placeholder="请选择" style="width:100%;">
            <el-option v-for="(item, index) in ['3段', '4段', '5段']" :key="index" :label="item" :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备/孔号" style="flex: 2;">
          <div class="row-flex">
            <el-input v-model="device.name"></el-input>
            <el-input v-model="groupAB.a">
              <i slot="suffix" class="el-input__icon">A组</i>
            </el-input>
            <el-input v-model="groupAB.b">
              <i slot="suffix" class="el-input__icon">B组</i>
            </el-input>
          </div>
        </el-form-item>
        <div class="el-checkbox-group" style="display: flex; justify-content: center;">
          <!-- <el-radio v-model="taskData.two" :label="true" border>二次张拉</el-radio> -->
          <!-- <el-radio v-model="taskData.exceed" :label="true" border>超张拉</el-radio> -->
          <el-checkbox v-model="taskData.two" :label="true" border>二次张拉</el-checkbox>
          <el-checkbox v-model="taskData.exceed" :label="true" border>超张拉</el-checkbox>
        </div>
      </div>
    <!-- 张拉数据 -->
      <table class="tendon-item" width="100%">
        <tr>
          <!-- ['初张拉','阶段一','阶段二','阶段三','终张拉','超张拉'] -->
          <th width="80px">张拉数据</th>
          <th v-for="(item, index) in stage" :key="index" :class="{'two': index===2&&taskData.two, 'exceed': index===stage.length-1&&taskData.exceed, }">{{item}}</th>
          <th width="120px">工作长度</th>
          <th width="120px">内缩量均值</th>
          <th width="120px">理论伸长量</th>
        </tr>
        <tr>
          <td>张拉阶段</td>
          <td v-for="(item, index) in stage" :key="index">
            <el-input v-model="taskData.task.stage[index]">
              <i slot="suffix" class="el-input__icon">%</i>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>控制应力</td>
          <td v-for="(item, index) in stage" :key="index">
            <el-input :value="(taskData.task.stage[index]/100*taskData.tensioningKN).toFixed(2)">
              <i slot="suffix" class="el-input__icon">kn</i>
            </el-input>
          </td>
        </tr>
        <tr :class="item" v-for="(item, index) in ['A1','A2','B1','B2']" :key="index"
          v-if="item in taskData.task">
          <td>{{item}}</td>
          <td v-for="(i, index) in stage" :key="index" >
            <el-input
              v-if="device.equation"
              :value="(((taskData.task.stage[index] / 100 * taskData.tensioningKN).toFixed(2) - (device[item].b * 1)) / device[item].a).toFixed(2)">
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
            <el-input
              v-if="!device.equation"
              :value="((taskData.task.stage[index] / 100 * taskData.tensioningKN).toFixed(2) * device[item].a + (device[item].b * 1)).toFixed(2)">
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
          </td>
          <!-- 工作长度 -->
          <td>
            <el-input v-model="taskData.task[item].LQ">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 内缩量均值 -->
          <td>
            <el-input v-model="taskData.task[item].NS">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 理论生长量 -->
          <td
            :rowspan="taskData.tensioningPattern !== 0 ? 2 : 1"
            :class="{'h': taskData.tensioningPattern !== 0}"
            v-if="item === 'A1'">
            <el-input v-model="taskData.task[item].LL">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 理论生长量 -->
          <td
            :rowspan="taskData.tensioningPattern !== 2 ? 2 : 1"
            :class="{'h' : taskData.tensioningPattern !== 2}"
            v-if="item === 'B1'">
            <el-input v-model="taskData.task[item].LL">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>持荷时间</td>
          <td v-for="(item, index) in stage" :key="index">
            <el-input v-model="taskData.task.time[index]">
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
    props: ['taskData', 'deviceId'],
    data: () => ({
      ccc: 0,
      value: '',
    }),
    computed: {
      device() {
        return window.deviceDB.getOne({ id: this.deviceId });
      },
      groupAB() {
        const arr = this.taskData.name.split('/');
        return { a: arr[0], b: arr[1] };
      },
      stage() {
        // ['初张拉','阶段一','阶段二','阶段三','终张拉','超张拉']
        const d = this.taskData;
        let s = [];
        if (d.two && d.stage < 1) {
          d.stage = 1;
        }
        switch (d.stage) {
          case 0:
            d.task.stage = [10, 20, 100];
            d.task.time = [30, 30, 300];
            s = ['初张拉', '阶段一', '终张拉'];
            break;
          case 1:
            d.task.stage = [10, 20, 50, 100];
            d.task.time = [30, 30, 30, 300];
            s = ['初张拉', '阶段一', '阶段二', '终张拉'];
            break;
          case 2:
            d.task.stage = [10, 20, 50, 80, 100];
            d.task.time = [30, 30, 30, 30, 300];
            s = ['初张拉', '阶段一', '阶段二', '阶段三', '终张拉'];
            break;
          default:
            break;
        }
        if (d.exceed) {
          d.task.stage.push(110);
          d.task.time.push(300);
          s.push('超张拉');
        }
        return s;
      },
    },
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
    .two{
      background-color: yellow;
    }
    .exceed{
      background-color: red;
    }
  }
</style>
