<template>
  <div class="wh100">
    <!-- 张拉数据 -->
    <el-form>
      <table class="record-item" width="100%">
        <tr>
          <th width="80px">记录数据</th>
          <th v-for="(item, index) in stageStr" :key="index">{{item}}</th>
          <th >回油至初张拉</th>
          <th width="108px">力筋回缩量</th>
          <!-- <th width="120px">工作长度</th>
          <th width="120px">理论伸长量</th> -->
          <th width="108px">总伸长量</th>
          <th width="108px">伸长量偏差值</th>
        </tr>
        <tr :class="item" v-for="(item, index) in patternStr" :key="index">
          <td>{{item}}</td>
          <td v-for="(i, index) in stageStr" :key="index">
            <el-input :value="taskData.recird[item].Mpa[index] | plc2mpa">
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
            <el-input :value="taskData.recird[item].Mpa[index] | plc2kn(deviceId, item)">
              <i slot="suffix" class="el-input__icon">Kn</i>
            </el-input>
            <el-input :value="taskData.recird[item].mm[index] | plc2mm">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 回油至初张拉数据 -->
          <td>
            <el-input :value="taskData.recird[item].initMpa | plc2mpa">
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
            <el-input :value="taskData.recird[item].initMpa | plc2kn(deviceId, item)">
              <i slot="suffix" class="el-input__icon">Kn</i>
            </el-input>
            <el-input :value="taskData.recird[item].initMM | plc2mm">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 力筋回缩量 -->
          <td class="h3">
            <el-input :value="taskData.recird[item].retractionMM | plc2mm">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 工作长度 -->
          <!-- <td class="h3">
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td> -->
          <!-- 理论生长量 -->
          <!-- <td rowspan="2" class="h6" v-if="index===0 || index===2">
            <el-input value="123456">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td> -->
          <!-- 总伸长量 -->
          <td rowspan="2" class="h6" v-if="index===0 || index===2">
            <el-input :value="taskData.recird[item].mm | LZ(taskData.task[item].NS, taskData.task[item].LQ)">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 伸长量偏差 -->
          <td rowspan="2" class="h6" v-if="index===0 || index===2">
            <el-input :value="taskData.recird[item].deviation">
              <i slot="suffix" class="el-input__icon">%</i>
            </el-input>
          </td>
        </tr>
        <tr>
          <td>持荷时间</td>
          <td v-for="(item, index) in taskData.recird.time" :key="index">
            <el-input :value="item">
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
    name: 'recordShow',
    props: ['taskData', 'deviceId'],
    data: () => ({
      patternStr: [],
      stageStr: [],
    }),
    beforeMount() {
      this.patternStr = this.$Ounity.abModel(this.taskData.tensioningPattern); // 张拉模式
      this.stageStr = this.$Ounity.stage(this.taskData.stage, this.taskData.exceed); // 张拉阶段
    },
  };

</script>

<style lang="scss">
  .record-item {
    .h3 {
      .el-input--small .el-input__inner {
        height: 99px;
      }
    }
    .h6 {
      .el-input--small .el-input__inner {
        height: 198px;
      }
    }
    td {
      text-align: center;
    }
  }

</style>
