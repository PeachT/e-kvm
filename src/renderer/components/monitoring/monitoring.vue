<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-header height="40px">
        <router-link to="/menu">菜单</router-link>
        <el-button @click="bitOut(1280, true)">开</el-button>
        <el-button @click="bitOut(1280, false)">关</el-button>
        <el-button @click="get()">读取线圈状态</el-button>
        <el-button @click="readRegisters16()">读取寄存器数据</el-button>
        <el-button @click="writeMultipleCoil()">强制多线圈</el-button>
        <el-button @click="writeSingleRegister16()">写入单个16位寄存器</el-button>
        <el-button @click="writeMultipleRegisters16()">写入多个16位寄存器</el-button>
        <el-button @click="reconnect()">重新连接</el-button>
        <i class="el-icon-info PLC" :class="{'on': PLCState1}"></i>
        <i class="el-icon-info PLC" :class="{'on': PLCState2}"></i>
      </el-header>
      <el-main>
        <div>
          <steps :stage="stageStr" :nowStage="nowStage" :times="nowData.task.time" :recirdTime="recird.time" :tAB="tABNumber"></steps>

          <table width="100%" border="1" cellspacing="0">
            <tr>
              <th>设备</th>
              <th>状态</th>
              <th>顶位移</th>
              <th>设备压力</th>
              <th>目标压力</th>
              <th>单顶伸长量</th>
              <th>单顶偏差率</th>
              <th>理论伸长量</th>
              <th>总伸长量</th>
              <th>总偏差率</th>
            </tr>
            <tr :class="item" v-for="(item, index) in stage" :key="index">
              <td>{{item}}</td>
              <td>{{abStage[currentlyState[`${item}`]]}}</td>
              <td>{{currentlyData[`${item}mm`] | plc2mm}}</td>
              <td>{{currentlyData[`${item}mpa`] | plc2mpa}}</td>
              <td>{{pressure.stagesMpa[item][PLCStage]}}</td>
              <td>单顶伸长量</td>
              <td rowspan="2" v-if="item === 'A1' || item === 'B1'">单顶偏差率</td>
              <td rowspan="2" v-if="item === 'A1' || item === 'B1'">{{nowData.task[item].LL}}</td>
              <td rowspan="2" v-if="item === 'A1' || item === 'B1'">总伸长量</td>
              <td rowspan="2" v-if="item === 'A1' || item === 'B1'">总偏差率</td>
            </tr>
          </table>
        </div>
        <div style="display: flex;">
          <!-- <veline style="flex:1;" title="压力曲线" max="60"></veline>
          <veline style="flex:1;" title="压力曲线" max="220"></veline>
          'data', 'time', 'showState', 'stageStr'-->
          <curves-svg
            ref="mpaCurves"
            :data="cMpa"
            :time="{start: recird.startDate, end: recird.endDate}"
            :showState="false"
            :stageStr="stage"/>
        </div>
      </el-main>
      <el-footer height="40px">Footer</el-footer>
    </el-container>
    <el-dialog
      title="张拉"
      :visible="taskDownData.state"
      width="60%"
      >
      <div>
        可以张拉
        <el-form label-width="85">
          <h3>混泥土信息</h3>
          <div class="row-flex">
            <el-form-item :label="item[1]"
              v-for="(item, index) in [['sampleNumber', '试块编号'], ['sampleStrength', '试块强度'], ['designStrength', '设计强度'],['tensioningStrengthNow','张拉时砼强度']]"
              :key="index">
              <el-input v-model="taskData.concretes[item[0]]"></el-input>
            </el-form-item>
            <el-form-item label="浇筑日期">
              <el-date-picker style="width:100%;" type="date" placeholder="选择日期" v-model="taskData.concretes.castingDate" @change="concretesFunc()"></el-date-picker>
            </el-form-item>
          </div>
          <p>{{concretesState ? '请设置浇筑日期！' : '可以启动张拉'}}</p>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消张拉</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// concretes: { // 混凝土数据
//       sampleNumber: '试块编号',
//       sampleStrength: '试块强度',
//       designStrength: '设计强度',
//       tensioningStrengthNow: '张拉时强度',
//       castingDate: '浇筑日期',
//     },
import Steps from './steps/steps';
import CurvesSvg from './d3curves';

const returnData = require('../../modbus-tcp/returnData').default.returnData16;

export default {
  name: 'monitoring',
  components: {
    CurvesSvg,
    Steps,
  },
  data: () => ({
    mpas: [2, 3, 4, 5, 8, 10],
    start: false,
    taskDownData: {
      state: false,
    },
    concretesState: false,
    taskData: {
      concretes: { // 混凝土数据
        sampleNumber: null, // '试块编号',
        sampleStrength: null, // '试块强度',
        designStrength: null, // '设计强度',
        tensioningStrengthNow: null, // '张拉时强度',
        castingDate: null, // '浇筑日期',
      },
    },
    nowData: null,
    stage: [],
    pressure: null,
    nowStage: 0,
    PLCStage: 0,
    stageStr: [],
    currentlyState: {
      A1: 0,
      A2: 0,
      B1: 0,
      B2: 0,
    },
    tA1: null,
    tA2: null,
    tB1: null,
    tB2: null,
    tAB: null,
    tGet: null,
    tABNumber: 0,
    sA1: null,
    sA2: null,
    sB1: null,
    sB2: null,
    recird: { // 记录数据
      startDate: null, // 张拉时间
      endDate: null, // 张拉完成时间
      time: [0, 0, 0, 0, 0, 0], // 持荷时间
      A1: {
        Mpa: [], // 压力
        mm: [], // 位移
        initMpa: null, // 回到初张拉压力
        initMM: null, // 回到初张拉位移
        retractionMM: 0, // 力筋回缩量
        LZ: 0, // 总伸长量（LZ）
        deviation: 0, // 偏差率
      },
      A2: {
        Mpa: [], // 压力
        mm: [], // 位移
        initMpa: 0, // 回到初张拉压力
        initMM: 0, // 回到初张拉位移
        retractionMM: 0, // 力筋回缩量
      },
      B1: {
        Mpa: [], // 压力
        mm: [], // 位移
        initMpa: null, // 回到初张拉压力
        initMM: null, // 回到初张拉位移
        retractionMM: 0, // 力筋回缩量
        LZ: 0, // 总伸长量（LZ）
        deviation: 0, // 偏差率
      },
      B2: {
        Mpa: [], // 压力
        mm: [], // 位移
        initMpa: 0, // 回到初张拉压力
        initMM: 0, // 回到初张拉位移
        retractionMM: 0, // 力筋回缩量
      },
    },
    tcurves: null,
    tcurves1: null,
    curves: {
      A1Mpa: [],
      A2Mpa: [],
      B1Mpa: [],
      B2Mpa: [],
      A1mm: [],
      A2mm: [],
      B1mm: [],
      B2mm: [],
    },
  }),
  beforeMount() {
    if (window.nowDB.getAll.length > 0) {
      this.taskDownData.state = true;
      const uid = window.nowDB.getAll[0].uid;
      const id = window.nowDB.getAll[0].id;
      const name = window.nowDB.getAll[0].name;
      this.pressure = window.nowDB.getAll[0].pressure;
      this.taskData = window.tensioningDB.getCollection(uid).findOne({ id: id });
      this.nowData = this.taskData.data.filter(item => item.name === name)[0];
      this.stage = this.$Ounity.abModel(this.nowData.tensioningPattern);
      this.stageStr = this.$Ounity.stage(this.nowData.stage, this.nowData.exceed);
      this.stageDownPLC();
      if (this.taskData.concretes.castingDate === null) {
        this.concretesState = true;
      }
      this.x0();
    }
  },
  computed: {
    PLCState1() {
      return this.$store.state.global.PLC1State;
    },
    PLCState2() {
      return this.$store.state.global.PLC2State;
    },
    abStage() {
      const abStage = [
        ['等待张拉', '初张拉', '阶段一张拉', '终张拉'],
        ['等待张拉', '初张拉', '阶段一张拉', '阶段二张拉', '终张拉'],
        ['等待张拉', '初张拉', '阶段一张拉', '阶段二张拉', '阶段三张拉', '阶段三保压', '终张拉'],
      ];
      const arr = abStage[this.nowData.stage];
      if (this.nowData.exceed) {
        arr.push('超张拉');
      }
      arr.push('卸荷', '回程', '等待保压', '保压中...');
      return arr;
    },
    // 实时压力位移数据
    currentlyData() {
      const p1 = this.$store.state.global.PLC1Data;
      const p2 = this.$store.state.global.PLC2Data;
      return {
        A1mpa: p1.A1mpa,
        A1mm: p1.A1mm,
        B1mpa: p1.B1mpa,
        B1mm: p1.B1mm,
        A2mpa: p2.A2mpa,
        A2mm: p2.A2mm,
        B2mpa: p2.B2mpa,
        B2mm: p2.B2mm,
      };
    },
    // 压力曲线数据
    cMpa() {
      const d = {
        A1: [],
        A2: [],
        B1: [],
        B2: [],
      };
      this.stage.forEach((item) => {
        d[item] = this.curves[`${item}Mpa`];
      });
      return d;
    },
  },
  methods: {
    bitOut(address, value) {
      this.$plc1.writeSingleCoil(address, value, (data) => {
        console.log('PLC返回写入单线圈：', data);
      });
    },
    get() {
      this.$plc1.readCoilStatue(1280, 5, (data) => {
        console.log('PLC返回读取多线圈', data);
      });
    },
    readRegisters16() {
      this.$plc1.readRegisters16(1536, 6, (data) => {
        console.log('PLC返回读取16位寄存器：', returnData(data));
      });
    },
    writeMultipleCoil() {
      this.$plc1.writeMultipleCoil(1280, [1, 0, 1, 0, 1], (data) => {
        console.log('PLC返回写入多线圈：', data);
      });
    },
    writeSingleRegister16() {
      this.$plc1.writeSingleRegister16(1536, 100, (data) => {
        console.log('PLC返回写入16位单寄存器：', data);
      });
    },
    writeMultipleRegisters16() {
      const datas = [54, 101, 102, 103, 104, 105];
      this.$plc1.writeMultipleRegisters16(4596, datas, (data) => {
        console.log('PLC返回写入16位多寄存器：', data);
      });
    },
    reconnect() {
      this.$plc1.reconnect();
    },
    // 设置浇筑日期
    concretesFunc() {
      if (this.taskData.concretes.castingDate !== null) {
        this.concretesState = false;
      }
    },
    // 取消张拉
    cancel() {
      try {
        window.nowDB.c.chain().find().remove();
        // $db.save();
        window.nowDB.db.save();
      } catch (error) {
        console.error(error);
      }
      console.log(window.nowDB.getAll);
      this.$router.push('/menu');
    },
    // 监控启动
    x0() {
      window.setTimeout(() => {
        this.$plc1.readInputStatue(1024, 1, (data) => {
          const x0 = returnData(data)[0];
          if (x0 === '1' && !this.concretesState) {
            new Promise(
              (resolve, reject) => {
                this.$plc2.writeSingleCoil(2560, true, (data) => {
                  console.log('PLC返回写入单线圈：', data);
                });
                this.$plc1.writeSingleCoil(2560, true, (data) => {
                  console.log('PLC返回写入单线圈：', data);
                  resolve();
                });
              },
            ).then(this.startFunc());
          } else if (x0 === '1') {
            this.$message.error('请输入浇筑日期！');
          }
          if (window.nowDB.getAll.length > 0 && this.taskDownData.state) {
            this.x0();
          }
        });
      }, 0);
    },
    // 启动张拉
    startFunc() {
      this.taskDownData.state = false;
      this.nowStage = 1;
      this.currentlyState.A1 = 1;
      this.currentlyState.A2 = 1;
      this.currentlyState.B1 = 1;
      this.currentlyState.B2 = 1;
      // 保存开始时间
      this.recird.startDate = this.$unity.timeMs();
      // this.mmBase =
      this.$message.success('开始张拉！！');
      this.getPLC();
      this.curvesTime();
    },
    // 下载压力数据到PLC
    stageDownPLC() {
      const m = this.nowData.tensioningPattern;
      const mpas = this.pressure.plcPressure;
      const stage = this.PLCStage;
      console.log(mpas, mpas.A1[stage]);
      if (m === 0 || m === 1 || m === 4) {
        this.$plc1.writeSingleRegister16(4106, mpas.A1[stage], (data) => {
          console.log('PLC返回写入16位多寄存器：', data);
        });
      }
      if (m === 2 || m === 3 || m === 4) {
        this.$plc1.writeSingleRegister16(4107, mpas.B1[stage], (data) => {
          console.log('PLC返回写入16位多寄存器：', data);
        });
      }
      if (m === 1 || m === 4) {
        this.$plc2.writeSingleRegister16(4106, mpas.A2[stage], (data) => {
          console.log('PLC返回写入16位多寄存器：', data);
        });
      }
      if (m === 3 || m === 4) {
        this.$plc2.writeSingleRegister16(4107, mpas.B2[stage], (data) => {
          console.log('PLC返回写入16位多寄存器：', data);
        });
      }
    },
    // 压力监控
    getPLC() {
      this.tGet = setTimeout(() => {
        const m = this.nowData.tensioningPattern;
        const mpas = this.pressure.plcPressure;
        const stage = this.PLCStage;
        this.stage.forEach((item) => {
          if (this.currentlyData[`${item}mpa`] >= mpas[item][stage]) {
            if (this[`t${item}`] === null) {
              this[`t${item}`] = setTimeout(() => {
                this.currentlyState[item] = this.abStage.length - 2;
                this[`s${item}`] = true;
              }, 1500);
            }
          } else {
            clearTimeout(this[`t${item}`]);
            this[`t${item}`] = null;
          }
        });
        switch (true) {
          case m === 0 && this.sA1:
            this.currentlyState.A1 = this.abStage.length - 1;
            // 进入保压
            this.time();
            break;
          case m === 1 && this.sA1 && this.sA2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = this.abStage.length - 1;
            });
            // 进入保压
            this.time();
            break;
          case m === 2 && this.sB1:
            this.currentlyState.B1 = this.abStage.length - 1;
            // 进入保压
            this.time();
            break;
          case m === 3 && this.sB1 && this.sB2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = this.abStage.length - 1;
            });
            // 进入保压
            this.time();
            break;
          case m === 4 && this.sA1 && this.sA2 && this.sB1 && this.sB2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = this.abStage.length - 1;
            });
            // 进入保压
            this.time();
            break;
          default:
            this.getPLC();
            break;
        }
      }, 0);
    },
    // 保压延时
    time() {
      clearTimeout(this.tGet);
      this.tGet = null;
      this.tAB = setInterval(() => {
        const PLCStage = this.PLCStage;
        this.tABNumber += 1;
        this.recird.time[PLCStage] = this.tABNumber;
        // 判断保压完成？
        if (this.tABNumber === this.nowData.task.time[PLCStage]) {
          window.clearInterval(this.tAB);
          this.tAB = null;
          // 下一阶段
          this.nowStage += 1;
          // 延时清零
          this.tABNumber = 0;
          this.stage.forEach((item) => {
            this.recird[item].Mpa[PLCStage] = this.currentlyData[`${item}mpa`];
            this.recird[item].mm[PLCStage] = this.currentlyData[`${item}mm`];
            // 保压状态解除
            this[`s${item}`] = false;
            // 保压定时器清楚
            this[`t${item}`] = null;
            // 顶阶段
            this.currentlyState[`${item}`] = this.nowStage;
          });
          if (this.stageStr.length - 1 > this.nowStage) {
            this.PLCStage += 1;
            this.stageDownPLC();
            this.getPLC();
          } else {
            // 张拉完成定时器清除
            clearTimeout(this.tcurves);
            clearTimeout(this.tcurves1);
            this.curvesFunc();
          }
        }
      }, 1000);
    },
    // 曲线采集
    curvesTime() {
      this.tcurves = setInterval(() => {
        this.curvesFunc();
      }, 5000);
      this.tcurves1 = setInterval(() => {
        this.stage.forEach((item) => {
          this.curves[`${item}Mpa`][this.curves[`${item}Mpa`].length - 1] = (this.currentlyData[`${item}mpa`]);
          this.curves[`${item}mm`][this.curves[`${item}mm`].length - 1] = (this.currentlyData[`${item}mm`]);
        });
        this.recird.endDate = this.$unity.timeMs();
        this.$refs.mpaCurves.initData(); // 曲线更新
      }, 1000);
    },
    // 曲线保存
    curvesFunc() {
      this.stage.forEach((item) => {
        this.curves[`${item}Mpa`].push(this.currentlyData[`${item}mpa`]);
        this.curves[`${item}mm`].push(this.currentlyData[`${item}mm`]);
      });
      this.recird.endDate = this.$unity.timeMs();
    },
  },
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
.PLC{
  color: #909399;
  &.on{
    color: #67C23A;
    animation: 2s rainbow infinite alternate;
  }
}
@keyframes rainbow {
  // 0% { background: #c00; }
  // 50% { background: orange; }
  // 100% { background: yellowgreen; }
  0% { opacity: 1 }
  to { opacity: .5 }
}
</style>
