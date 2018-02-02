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
            <el-input :value="retractionMM[item]">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 总伸长量 -->
          <td :rowspan="patternStr.length >1 ? 2: 1" :class="{'h6': patternStr.length >1, 'h3': patternStr.length === 1}" v-if="index===0 || index===2">
            <el-input :value="LZ[item].mm">
              <i slot="suffix" class="el-input__icon">mm</i>
            </el-input>
          </td>
          <!-- 伸长量偏差 -->
          <td :rowspan="patternStr.length >1 ? 2: 1" :class="{'h6': patternStr.length >1, 'h3': patternStr.length === 1}" v-if="index===0 || index===2">
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
      retractionMM: {
        A1: null,
        A2: null,
        B1: null,
        B2: null,
      },
    }),
    beforeMount() {
      this.get();
      this.recirdFunc();
      this.retraction();
    },
    watch: {
      taskData() {
        this.get();
        this.recirdFunc();
        this.retraction();
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
        this.recird = {
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
        };
        const recird = this.taskData.recird;
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
      retraction() {
        // 力筋回缩量Sn=（LK-LM）-(1-σ0/σk)LQ
        const sensor = window.systemDB.getOne({ name: 'sensor' });
        const l = this.taskData;
        const stage = this.$Ounity.abModel(l.tensioningPattern); // 张拉模式
        stage.forEach((item) => {
          const length = this.recird[item].mm.length - 1;
          const LK = this.recird[item].mm[length];
          const LM = this.$UC.plc2mm(l.recird[item].initMM, item);
          const Q0 = this.recird[item].Mpa[0];
          const Qk = this.recird[item].Mpa[length];
          const LQ = l.task[item].LQ;
          console.log(LK, LM, Q0, Qk, LQ);
          this.retractionMM[item] = (((LK - LM) - (1 - (Q0 / Qk))) * LQ).toFixed(sensor.toFixed);
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
