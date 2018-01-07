<template>
  <div class="wh100">
    <!--  -->
    <el-form label-width="85px">
      <div class="row-flex">
        <el-form-item label="控制应力">
          <el-input v-model.number="taskData.tensioningKN" type="number"></el-input>
        </el-form-item>
        <el-form-item label="张拉长度">
          <el-input v-model.number="taskData.length" type="number">
            <i slot="suffix" class="el-input__icon">m</i>
          </el-input>
        </el-form-item>
        <el-form-item label="钢绞线数量">
          <el-input v-model.number="taskData.steelStrandNumber" type="number"></el-input>
        </el-form-item>
      </div>
      <div class="row-flex">
        <el-form-item label="设备/孔号" >
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
        <el-form-item label="张拉工艺">
          <el-select v-model="taskData.stage" placeholder="请选择" style="width:100%;">
            <el-option v-for="(item, index) in ['3段', '4段', '5段']" :key="index" :label="item" :value="index" @change="stageFunc()">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="el-checkbox-group" style="display: flex; justify-content: center;">
          <!-- <el-radio v-model="taskData.two" :label="true" border>二次张拉</el-radio> -->
          <!-- <el-radio v-model="taskData.exceed" :label="true" border>超张拉</el-radio> -->
          <el-checkbox v-model="taskData.two" :label="true" border @change="stageFunc()">二次张拉</el-checkbox>
          <el-checkbox v-model="taskData.exceed" :label="true" border @change="stageFunc()">超张拉</el-checkbox>
        </div>
      </div>
    <!-- 张拉数据 -->
      <table class="tendon-item" width="100%">
        <tr>
          <!-- ['初张拉','阶段一','阶段二','阶段三','终张拉','超张拉'] -->
          <th width="80px">张拉数据</th>
          <th v-for="(item, index) in stageStr" :key="index" :class="{'two': index===2&&taskData.two, 'exceed': index===stageStr.length-1&&taskData.exceed, }">{{item}}</th>
          <th width="108px">工作长度</th>
          <th width="108px">内缩量均值</th>
          <th width="108px">理论伸长量</th>
        </tr>
        <tr>
          <td>张拉阶段</td>
          <td v-for="(item, index) in matrixing.stages" :key="index">
            <el-input v-model.number="taskData.task.stage[index]" type="number">
              <i slot="suffix" class="el-input__icon">%</i>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>控制应力</td>
          <td v-for="(item, index) in matrixing.stagesKN" :key="index">
            <el-input :value="item">
              <i slot="suffix" class="el-input__icon">kn</i>
            </el-input>
          </td>
        </tr>
        <tr :class="item" v-for="(item, index) in ['A1','A2','B1','B2']" :key="index"
          v-if="item in taskData.task">
          <td>{{item}}</td>
          <td v-for="(i, index) in matrixing.stagesMpa[item]" :key="index" >
            <el-input :value="i">
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
          <td v-for="(item, index) in taskData.task.time" :key="index">
            <el-input v-model.number="taskData.task.time[index]" type="number">
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
  const pressure = require('../../../objJS/matrixing').default.pressure;
  export default {
    name: 'main',
    props: ['taskData', 'deviceId'],
    data: () => ({
      ccc: 0,
      value: '',
    }),
    computed: {
      matrixing() {
        const s = pressure(this.taskData, this.deviceId);
        this.taskData.task.stage = s.stages;
        return s;
      },
      device() {
        return window.deviceDB.getOne({ id: this.deviceId });
      },
      groupAB() {
        const arr = this.taskData.name.split('/');
        return { a: arr[0], b: arr[1] };
      },
      stageStr() {
        return this.$Ounity.stage(this.taskData.stage, this.taskData.exceed);
      },
    },
    methods: {
      ttt(e) {
        console.log(e, this.taskData.task.stage);
      },
      stageFunc() {
        // ['初张拉','阶段一','阶段二','阶段三','终张拉','超张拉']
        const d = this.taskData;
        if (d.two && d.stage < 1) {
          d.stage = 1;
        }
        switch (d.stage) {
          case 0:
            d.task.stage = [10, 20, 100];
            d.task.time = [30, 30, 300];
            break;
          case 1:
            d.task.stage = [10, 20, 50, 100];
            d.task.time = [30, 30, 30, 300];
            break;
          case 2:
            d.task.stage = [10, 20, 50, 80, 100];
            d.task.time = [30, 30, 30, 30, 300];
            break;
          default:
            break;
        }
        if (d.exceed) {
          d.task.stage.push(110);
          d.task.time.push(300);
        }
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
