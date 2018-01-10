<template>
  <div class="wh100 root">
    <el-container class="wh100">
      <el-header class="status-bar" height="32px">
        <!-- <router-link to="/menu">菜单</router-link>
        <el-button @click="bitOut(1280, true)">开</el-button>
        <el-button @click="bitOut(1280, false)">关</el-button>
        <el-button @click="get()">读取线圈状态</el-button>
        <el-button @click="readRegisters16()">读取寄存器数据</el-button>
        <el-button @click="writeMultipleCoil()">强制多线圈</el-button>
        <el-button @click="writeSingleRegister16()">写入单个16位寄存器</el-button>
        <el-button @click="writeMultipleRegisters16()">写入多个16位寄存器</el-button>
        <el-button @click="reconnect()">重新连接</el-button> -->
        <span class="title">·自动张拉· {{girderName}} · 梁号:{{taskData.bridgeName}} · 孔号:{{nowData.name}}</span>
        <el-button class="btn-menu" type="primary" icon="el-icon-menu" v-show="menuShow" @click="$store.commit('showMenu', !$store.state.global.showMenu)"></el-button>
        <el-button-group class="btn-menu PLC">
            <el-button :class="{'on': PLCState1}" :icon="PLCState1 ? 'el-icon-success' : 'el-icon-warning'">从站</el-button>
            <el-button :class="{'on': PLCState2}" :icon="PLCState2 ? 'el-icon-success' : 'el-icon-warning'">主站</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <home-menu class="root-menu" v-if="$store.state.global.showMenu"></home-menu>
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
        <div style="display: flex;" class="auto">
          <curves-svg
            ref="mpaCurves"
            :data="curves"
            :time="{start: recird.startDate, end: recird.endDate}"
            :tensioningPattern="nowData.tensioningPattern"
            refName="Mpa"/>
          <curves-svg
            ref="mmCurves"
            :data="curves"
            :time="{start: recird.startDate, end: recird.endDate}"
            :tensioningPattern="nowData.tensioningPattern"
            refName="mm"/>
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
// import CurvesSvg from './d3curves';
import CurvesSvg from '../task_record_template/d3svg.vue';
import HomeMenu from '../menus/menu.vue';

const returnData = require('../../modbus-tcp/returnData').default.returnData16;
const pressurePLC = require('../../objJS/matrixing').default.pressurePLC;

export default {
  name: 'monitoring',
  components: {
    CurvesSvg,
    Steps,
    HomeMenu,
  },
  data: () => ({
    menuShow: false,
    girderName: null,
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
    },
    tcurves: null,
    tcurves1: null,
    curves: {
    },
    // unloadData: { // 卸荷需要的数据
    //   t: null,
    //   A1: null,
    // },
  }),
  beforeMount() {
    if (window.nowDB.getAll.length > 0) {
      this.taskDownData.state = true;
      const uid = window.nowDB.getAll[0].uid; // 构件id
      this.girderName = window.girderDB.getOne({ id: uid }).name; // 获取构件名称
      const id = window.nowDB.getAll[0].id; // 梁id
      const name = window.nowDB.getAll[0].name; // 组名称
      this.taskData = window.tensioningDB.getCollection(uid).findOne({ id: id }); // 梁数据
      this.nowData = this.taskData.data.filter(item => item.name === name)[0]; // 组数据
      this.stage = this.$Ounity.abModel(this.nowData.tensioningPattern); // 张拉模式
      this.stageStr = this.$Ounity.stage(this.nowData.stage, this.nowData.exceed); // 张拉阶段
      this.pressure = pressurePLC(this.nowData, this.taskData.deviceId); // 数据换算
      const arrNull = [];
      this.nowData.task.time.forEach((item, index) => {
        arrNull.push(null);
      });
      this.recird.time = [...arrNull];
      this.stage.forEach((item) => {
        this.curves[`${item}Mpa`] = [];
        this.curves[`${item}mm`] = [];
        if (item === 'A1' || item === 'B1') {
          this.recird[item] = {
            Mpa: [...arrNull], // 压力
            mm: [...arrNull], // 位移
            initMpa: null, // 回到初张拉压力
            initMM: null, // 回到初张拉位移
            retractionMM: null, // 力筋回缩量
            LZ: null, // 总伸长量（LZ）
            deviation: null, // 偏差率
          };
        } else {
          this.recird[item] = {
            Mpa: [...arrNull], // 压力
            mm: [...arrNull], // 位移
            initMpa: null, // 回到初张拉压力
            initMM: null, // 回到初张拉位移
            retractionMM: null, // 力筋回缩量
          };
        }
      });
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
        console.log('1启动');
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
      this.curvesFunc();
      this.getPLC();
      this.curvesTime();
      this.$refs.mpaCurves.show();
      this.$refs.mmCurves.show();
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
        console.log('2启动');
        const m = this.nowData.tensioningPattern; // 张拉模式
        const n = this.abStage.length - 1; // 单顶的状态
        const mpas = this.pressure.plcPressure; // 阶段压力
        const stage = this.PLCStage; // plc当前阶段
        this.stage.forEach((item) => {
          if (this.currentlyData[`${item}mpa`] >= mpas[item][stage]) {
            if (this[`t${item}`] === null) {
              this[`t${item}`] = setTimeout(() => {
                console.log('3启动');
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
            this.currentlyState.A1 = n;
            // 进入保压
            this.time();
            break;
          case m === 1 && this.sA1 && this.sA2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = n;
            });
            // 进入保压
            this.time();
            break;
          case m === 2 && this.sB1:
            this.currentlyState.B1 = n;
            // 进入保压
            this.time();
            break;
          case m === 3 && this.sB1 && this.sB2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = n;
            });
            // 进入保压
            this.time();
            break;
          case m === 4 && this.sA1 && this.sA2 && this.sB1 && this.sB2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = n;
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
        console.log('8启动');
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
          // 下一阶段
          if (this.stageStr.length - 1 > this.nowStage) {
            this.PLCStage += 1;
            this.stageDownPLC();
            this.getPLC();
            // 张拉完成
          } else {
            // 曲线保存
            this.curvesFunc();
            // 卸荷执行
            new Promise(
              (resolve, reject) => {
                this.$plc2.writeSingleCoil(2561, true, (data) => {
                  console.log('PLC返回写入单线圈：', data);
                });
                this.$plc1.writeSingleCoil(2561, true, (data) => {
                  console.log('PLC返回写入单线圈：', data);
                  resolve();
                });
              },
              // 进入卸荷监控
            ).then(this.unloadFunc());
          }
        }
      }, 1000);
    },
    // 卸荷
    unloadFunc() {
      window.setTimeout(() => {
        console.log('4启动');
        const m = this.nowData.tensioningPattern; // 张拉模式
        // const n = this.abStage.length - 1; // 单顶的状态
        this.stage.forEach((item) => {
          if (this.currentlyData[`${item}mpa`] <= this.recird[item].Mpa[0]) {
            this[`tunload${item}`] = setTimeout(() => {
              console.log('5启动');
              this[`unload${item}`] = true;
              clearTimeout(this[`tunload${item}`]);
            }, 1500);
          } else {
            clearTimeout(this[`tunload${item}`]);
            this[`unload${item}`] = false;
          }
        });
        switch (true) {
          case m === 0 && this.unloadA1:
            this.currentlyState.A1 = this.nowStage;
            // 卸荷完成
            this.successFunc();
            break;
          case m === 1 && this.unloadA1 && this.unloadA2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = this.nowStage;
            });
            this.successFunc();
            break;
          case m === 2 && this.unloadB1:
            this.currentlyState.B1 = this.nowStage;
            this.successFunc();
            break;
          case m === 3 && this.unloadB1 && this.unloadB2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = this.nowStage;
            });
            this.successFunc();
            break;
          case m === 4 && this.unloadA1 && this.unloadA2 && this.unloadB1 && this.unloadB2:
            this.stage.forEach((item) => {
              this.currentlyState[`${item}`] = this.nowStage;
            });
            this.successFunc();
            break;
          default:
            this.unloadFunc();
            break;
        }
      }, 0);
    },
    // 曲线采集
    curvesTime() {
      this.tcurves = setInterval(() => {
        console.log('6启动');
        this.curvesFunc();
      }, 5000);
      this.tcurves1 = setInterval(() => {
        console.log('7启动');
        this.stage.forEach((item) => {
          const length = this.curves[`${item}Mpa`].length === 0 ? 0 : this.curves[`${item}Mpa`].length - 1;
          this.curves[`${item}Mpa`][length] = (this.currentlyData[`${item}mpa`]);
          this.curves[`${item}mm`][length] = (this.currentlyData[`${item}mm`]);
        });
        // this.recird.endDate = this.$unity.timeMs();
        this.$refs.mpaCurves.initData(); // 曲线更新
        this.$refs.mmCurves.initData(); // 曲线更新
      }, 500);
    },
    // 曲线保存
    curvesFunc() {
      this.stage.forEach((item) => {
        this.curves[`${item}Mpa`].push(this.currentlyData[`${item}mpa`]);
        this.curves[`${item}mm`].push(this.currentlyData[`${item}mm`]);
      });
      this.recird.endDate = this.$unity.timeMs();
      this.$refs.mpaCurves.initData(); // 曲线更新
      this.$refs.mmCurves.initData(); // 曲线更新
    },
    // 完成数据保存
    successFunc() {
      // 张拉完成曲线定时器清除
      clearTimeout(this.tcurves);
      clearTimeout(this.tcurves1);
      this.curvesFunc(); // 曲线保存
      this.nowData.recird = this.recird;
      this.nowData.curves = this.curves;
      this.nowData.state = 1; // 张拉状态 0未张拉 1张拉完成 2一次张拉完成 3张拉异常
      window.tensioningDB.getCollection(window.nowDB.getAll[0].uid).update(this.taskData);
      window.tensioningDB.save();
      this.$message.success('数据保存完成');
      this.menuShow = true;
      this.$store.commit('showMenu', !this.$store.state.global.showMenu);
      try {
        window.nowDB.c.chain().find().remove();
        // $db.save();
        window.nowDB.db.save();
      } catch (error) {
        console.error(error);
      }
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

<style lang="scss">
.auto {
  .el-loading-mask{
    z-index: 1;
  }
}
</style>
