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
            <el-input :value="recird[item].Mpa[index]">
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
            <el-input :value="recird[item].kn[index]">
              <i slot="suffix" class="el-input__icon">Kn</i>
            </el-input>
            <el-input :value="recird[item].mm[index]">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 回油至初张拉数据 -->
          <td>
            <el-input :value="taskData.recird[item].initMpa | plc2mpa(item, deviceId)">
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
            <el-input :value="taskData.recird[item].initMpa | plc2kn(item)">
              <i slot="suffix" class="el-input__icon">Kn</i>
            </el-input>
            <el-input :value="taskData.recird[item].initMM | plc2mm(item, deviceId)">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 力筋回缩量 -->
          <td class="h3">
            <el-input :value="taskData.recird[item].retractionMM | plc2mm(item, deviceId)">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 总伸长量 -->
          <td rowspan="2" class="h6" v-if="index===0 || index===2">
            <el-input :value="LZ[item].mm">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 伸长量偏差 -->
          <td rowspan="2" class="h6" v-if="index===0 || index===2">
            <el-input :value="LZ[item].deviation">
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
      recird: {
        startDate: null,
        endDate: null,
        A1: {
          Mpa: [], // 压力
          kn: [],
          mm: [], // 位移
          initMpa: null, // 回到初张拉压力
          initMM: null, // 回到初张拉位移
          retractionMM: null, // 力筋回缩量
        },
        A2: {
          Mpa: [], // 压力
          kn: [],
          mm: [], // 位移
          initMpa: null, // 回到初张拉压力
          initMM: null, // 回到初张拉位移
        },
        B1: {
          Mpa: [], // 压力
          mm: [], // 位移
          kn: [],
          initMpa: null, // 回到初张拉压力
          initMM: null, // 回到初张拉位移
          retractionMM: null, // 力筋回缩量
        },
        B2: {
          Mpa: [], // 压力
          kn: [],
          mm: [], // 位移
          initMpa: null, // 回到初张拉压力
          initMM: null, // 回到初张拉位移
        },
      },
    }),
    beforeMount() {
      this.get();
      this.recirdFunc();
    },
    watch: {
      taskData() {
        this.get();
        this.recirdFunc();
      },
    },
    computed: {
      LZ() {
        return this.$Ounity.LZ(this.taskData);
      },
    },
    methods: {
      get() {
        if (this.deviceId !== '') {
          this.patternStr = this.$Ounity.abModel(this.taskData.tensioningPattern); // 张拉模式
          this.stageStr = this.$Ounity.stage(this.taskData); // 张拉阶段
        }
      },
      recirdFunc() {
        const recird = this.taskData.recird;
        console.log('122222222222', recird);
        const timeFormat = this.$d3.timeFormat('%Y-%m-%d %H:%M:%S');
        this.recird.startDate = timeFormat(recird.startDate);
        this.recird.endDate = timeFormat(recird.endDate);
        this.patternStr.forEach((item) => {
          recird[item].Mpa.forEach((n, i) => {
            this.recird[item].Mpa[i] = this.$UC.plc2mpa(n, item);
            this.recird[item].kn[i] = (this.$UC.plc2kn(n, item));
            this.recird[item].mm[i] = this.$UC.plc2mm(recird[item].mm[i], item);
          });
        });
      },
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
