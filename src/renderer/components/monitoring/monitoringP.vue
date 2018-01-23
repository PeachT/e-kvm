<template>
  <div class="wh100 root">
    <el-container class="wh100">
      <el-header class="status-bar" height="32px">
        <span class="title">·自动张拉P· {{girderName}} · 梁号:{{taskData.bridgeName}} · 孔号:{{nowData.name}}</span>
        <el-button class="btn-menu" type="primary" icon="el-icon-menu" v-show="menuShow" @click="$store.commit('showMenu', !$store.state.global.showMenu)"></el-button>
        <el-button-group class="btn-menu PLC">
            <el-button :class="{'on': PLCState1}" :icon="PLCState1 ? 'el-icon-success' : 'el-icon-warning'">从站</el-button>
            <el-button :class="{'on': PLCState2}" :icon="PLCState2 ? 'el-icon-success' : 'el-icon-warning'">主站</el-button>
        </el-button-group>
      </el-header>
      <el-main class="main">
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
              <td>{{currentlyData[`${item}mm`] | plc2mm(item)}}</td>
              <td>{{currentlyData[`${item}mpa`] | plc2mpa(item)}}</td>
              <td>{{pressure.stagesMpa[item][PLCStage]}}</td>
              <td>{{LZ[`${item}dmm`]}}</td>
              <template v-if="item === 'A1' || item === 'B1'">
                <td rowspan="2" v-if="item === 'A1' || item === 'B1'">{{LZ[`${item}deviation`]}}</td>
                <td rowspan="2" v-if="item === 'A1' || item === 'B1'">{{nowData.task[item].LL}}</td>
                <td rowspan="2" v-if="item === 'A1' || item === 'B1'">{{LZ[item].mm}}</td>
                <td rowspan="2" v-if="item === 'A1' || item === 'B1'">{{LZ[item].deviation}}</td>
              </template>
            </tr>
          </table>
        </div>
        <div :style="{'height': svgh}" class="auto svg" ref="devSvg">
          <curves-svg
            h="100%"
            ref="mpaCurves"
            :data="curves"
            :time="{start: recird.startDate, end: recird.endDate}"
            :tensioningPattern="nowData.tensioningPattern"
            refName="Mpa"/>
          <curves-svg
            h="100%"
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
        <el-button type="success" @click="startReady()">启动张拉</el-button>
        <el-button @click="cancel()">取消张拉</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Steps from './steps/steps';
// import CurvesSvg from './d3curves';
import CurvesSvg from '../task_record_template/d3svg.vue';
import HomeMenu from '../menus/menu.vue';

const returnData = require('../../modbus-tcp/returnData').default.returnData16;
const pressurePLC = require('../../objJS/matrixing').default.pressurePLC;
const { ipcRenderer } = require('electron');

export default {
  name: 'monitoring',
  components: {
    CurvesSvg,
    Steps,
    HomeMenu,
  },
  data: () => ({
    svgh: 0,
    LZ: null,
    run: false, // 启动标示
    runT: true,
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
    curvesTime1S: false, // 曲线实时采集
    unloadS: false, // 卸荷监控
    monitorMpaS: false,
  }),
  mounted() {
    const svgMain = this.$refs.devSvg;
    this.svgh = svgMain.clientHeight;
  },
  beforeMount() {
    this.LZFunc();
    new Promise(this.ready0).then((val) => {
      console.log(val);
      return new Promise(this.DownPLC);
    }).then((val) => {
      console.log(val);
    });
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
      const r = {
        A1mpa: p1.A1mpa,
        A1mm: p1.A1mm,
        B1mpa: p1.B1mpa,
        B1mm: p1.B1mm,
        A2mpa: p2.A2mpa,
        A2mm: p2.A2mm,
        B2mpa: p2.B2mpa,
        B2mm: p2.B2mm,
      };
      if (this.run && this.runT) {
        this.runT = false;
        setTimeout(() => {
          this.runT = true;
          if (this.nowStage < this.stageStr.length - 1) {
            this.stage.forEach((item) => {
              // 位移保存
              this.recird[item].Mpa[this.PLCStage] = r[`${item}mpa`];
              this.recird[item].mm[this.PLCStage] = r[`${item}mm`];
            });
            this.LZFunc();
          }
          // 压力监控
          if (this.monitorMpaS) {
            new Promise(this.monitorMpa).then(() => {
              console.log('压力监控');
              this.monitorMpaS = true;
            });
          } else if (this.unloadS) { // 卸荷监控
            new Promise(this.unloadFunc).then(() => {
              this.unloadS = true;
            });
          }
          if (this.curvesTime1S) {
            new Promise(this.curvesTime1).then(() => {
              this.curvesTime1S = true;
            });
          }
        }, 500);
      }
      return r;
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
    // 伸长量偏差率
    LZFunc() {
      let lz = {
        A1dmm: null,
        A2dmm: null,
        B1dmm: null,
        B2dmm: null,
        A1deviation: null,
        B1deviation: null,
        A1: {
          mm: '没有数据',
          deviation: null,
        },
        B1: {
          mm: null,
          deviation: null,
        },
      };
      if (this.PLCStage >= 1) {
        lz = this.$Ounity.LZ(this.nowData, this.recird);
        console.log(this.recird);
        const sensor = window.systemDB.getOne({ name: 'sensor' }); // 传感器
        const fixed = sensor.toFixed;
        if ('A1dmm' in lz && 'A2dmm' in lz) {
          lz.A1deviation = (((lz.A1dmm - lz.A2dmm) / lz.A1dmm) * 100).toFixed(fixed);
        }
        if ('B1dmm' in lz && 'B2dmm' in lz) {
          lz.B1deviation = (((lz.B1dmm - lz.B2dmm) / lz.B1dmm) * 100).toFixed(fixed);
        }
      }
      this.LZ = lz;
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
    // 准备张拉处理
    ready0(resolve, reject) {
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
        window.deviceId = this.taskData.deviceId;
        const arrNull = [];
        // 记录数据结构
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
        // 浇筑日期判断
        if (this.taskData.concretes.castingDate === null) {
          this.concretesState = true;
        }
        resolve('数据准备完成！');
        // this.stageDownPLC();
        // this.x0();
      }
    },
    // 下载压力数据到PLC A=>D410=>4506 B=>D411
    DownPLC(resolve, reject) {
      const m = this.nowData.tensioningPattern; // 张拉泵顶组合
      const dowmZC = { // 下载完成回调名称
        z: `autoDown${m}Z`,
        c: `autoDown${m}C`,
      };
      const mpas = this.pressure.plcPressure; // 转换的压力数据
      const stage = this.PLCStage; // 张拉阶段
      const zData = [0, 0]; // 下载到主站的数据
      const cData = [0, 0]; // 下载到从站的数据
      this.zDowm = true; // 主站下载完成标示
      this.cDowm = true; // 从站下载完成标示
      // 数据拼接
      this.stage.forEach((item) => {
        switch (item) {
          case 'A1':
            zData[0] = mpas[item][stage];
            break;
          case 'B1':
            zData[1] = mpas[item][stage];
            break;
          case 'A2':
            cData[0] = mpas[item][stage];
            break;
          case 'B2':
            cData[1] = mpas[item][stage];
            break;
          default:
            break;
        }
      });
      console.log(zData, cData);
      // 主站下载
      ipcRenderer.send('wPLC1', { func: 'writeMultipleRegisters16', address: 4506, data: zData, callback: dowmZC.z });
      ipcRenderer.on(dowmZC.z, (event, data) => {
        console.log(data);
        this.zDowm = true;
        if (this.zDowm && this.cDowm) {
          resolve('数据下载完成！');
        }
      });
      // 从站下载
      if (m === 1 || m === 3 || m === 4) {
        ipcRenderer.send('wPLC2', { func: 'writeMultipleRegisters16', address: 4506, data: cData, callback: dowmZC.c });
        ipcRenderer.on(dowmZC.c, (event, data) => {
          this.cDowm = true;
          if (this.zDowm && this.cDowm) {
            resolve('数据下载完成！');
          }
        });
      }
    },
    // 启动等待
    startReady() {
      const m = this.nowData.tensioningPattern; // 张拉泵顶组合
      this.zTension = false;
      this.cTension = true;
      if (m === 1 || m === 3 || m === 4) {
        this.cTension = false;
        ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2568, data: true, callback: 'cTension' });
      }
      ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2568, data: true, callback: 'zTension' });
      ipcRenderer.on('zTension', (event, data) => {
        this.zTension = true;
        if (this.zTension && this.cTension) {
          this.runFunc();
        }
      });
      ipcRenderer.on('cTension', (event, data) => {
        this.cTension = true;
        if (this.zTension && this.cTension) {
          this.runFunc();
        }
      });
    },
    // 启动张拉
    runFunc() {
      this.run = true;
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
      new Promise((resolve, reject) => {
        this.Savecurves();
        this.curvesTime();
        // this.curvesTime1();
        this.$refs.mpaCurves.show();
        this.$refs.mmCurves.show();
        resolve('曲线处理完成');
      }).then((val) => {
        console.log(val);
      });
      this.monitorMpaS = true;
      this.curvesTime1S = true;
    },
    // 压力监控
    monitorMpa(resolve, reject) {
      this.monitorMpaS = false;
      const m = this.nowData.tensioningPattern; // 张拉模式
      const n = this.abStage.length - 1; // 单顶的状态
      const mpas = this.pressure.plcPressure; // 阶段压力
      const stage = this.PLCStage; // plc当前阶段
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
          resolve();
          break;
      }
    },
    // 保压
    time() {
      window.setTimeout(() => {
        const PLCStage = this.PLCStage;
        this.tABNumber += 1;
        // 保压时间保存
        this.recird.time[PLCStage] = this.tABNumber;
        if (this.tABNumber === this.nowData.task.time[PLCStage]) {
          this.successTime();
        } else {
          this.time();
        }
      }, 1000);
    },
    // 保压完成
    successTime() {
      // 延时清零
      this.tABNumber = 0;
      console.log('8启动', this.stageStr.length, this.PLCStage);
      const PLCStage = this.PLCStage;
      // 下一阶段
      this.nowStage += 1;
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
      if (this.PLCStage < this.stageStr.length - 3) {
        this.PLCStage += 1;
        // this.stageDownPLC(this.getPLC);
        new Promise(this.DownPLC).then((val) => {
          console.log(val);
          this.monitorMpaS = true;
        });
        // 张拉完成
      } else {
        this.allsuccessTime();
      }
    },
    // 全部保压完成
    allsuccessTime() {
      // 曲线保存
      this.Savecurves();
      // 卸荷执行
      const m = this.nowData.tensioningPattern; // 张拉模式
      this.zUnload = false;
      this.cUnload = true;

      // 卸荷压力
      const zData = [0, 0]; // 下载到主站的数据
      const cData = [0, 0]; // 下载到从站的数据
      this.stage.forEach((item) => {
        // if (this.currentlyData[`${item}mpa`] <= this.recird[item].Mpa[0]) {
        switch (item) {
          case 'A1':
            zData[0] = this.recird[item].Mpa[0];
            break;
          case 'B1':
            zData[1] = this.recird[item].Mpa[0];
            break;
          case 'A2':
            cData[0] = this.recird[item].Mpa[0];
            break;
          case 'B2':
            cData[1] = this.recird[item].Mpa[0];
            break;
          default:
            break;
        }
      });
      ipcRenderer.send('wPLC1', { func: 'writeMultipleRegisters16', address: 4508, data: zData });
      ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2569, data: true, callback: 'zUnload' });
      if (m === 1 || m === 3 || m === 4) {
        this.cUnload = false;
        ipcRenderer.send('wPLC1', { func: 'writeMultipleRegisters16', address: 4508, data: zData });
        ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2569, data: true, callback: 'cUnload' });
      }
      ipcRenderer.on('zUnload', (event, data) => {
        this.zUnload = true;
        if (this.zUnload && this.cUnload) {
          this.unloadS = true;
        }
      });
      ipcRenderer.on('cUnload', (event, data) => {
        this.cUnload = true;
        if (this.zUnload && this.cUnload) {
          this.unloadS = true;
        }
      });
    },
    // 卸荷监控
    unloadFunc(resolve, reject) {
      console.log('卸荷中。。。');
      this.unloadS = false;
      const m = this.nowData.tensioningPattern; // 张拉模式
      // const n = this.abStage.length - 1; // 单顶的状态
      this.stage.forEach((item) => {
        if (this.currentlyData[`${item}mpa`] <= this.recird[item].Mpa[0]) {
          this[`tunload${item}`] = setTimeout(() => {
            console.log('5启动');
            this[`unload${item}`] = true;
            this.recird[item].initMpa = this.currentlyData[`${item}mpa`];
            this.recird[item].initMM = this.currentlyData[`${item}mm`];
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
          resolve();
          break;
      }
    },
    // 曲线5s采集
    curvesTime() {
      this.tcurves = setTimeout(() => {
        console.log('曲线保存');
        this.Savecurves();
        if (this.run) {
          this.curvesTime();
        }
      }, 5000);
    },
    // 曲线实时采集
    curvesTime1(resolve, reject) {
      this.stage.forEach((item) => {
        const length = this.curves[`${item}Mpa`].length === 0 ? 0 : this.curves[`${item}Mpa`].length - 1;
        this.curves[`${item}Mpa`][length] = (this.currentlyData[`${item}mpa`]);
        this.curves[`${item}mm`][length] = (this.currentlyData[`${item}mm`]);
      });
      // this.recird.endDate = this.$unity.timeMs();
      this.$refs.mpaCurves.initData(); // 曲线更新
      this.$refs.mmCurves.initData(); // 曲线更新
      resolve();
    },
    // 曲线保存
    Savecurves() {
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
      ipcRenderer.send('wPLC1', { func: 'writeMultipleCoil', address: 2568, data: [0, 0] });
      ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2570, data: true });
      ipcRenderer.send('wPLC2', { func: 'writeMultipleCoil', address: 2568, data: [0, 0] });
      ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2570, data: true });
      // 张拉完成曲线定时器清除
      this.run = false;
      clearTimeout(this.tcurves);
      clearTimeout(this.tcurves1);
      this.Savecurves(); // 曲线保存
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

.main {
  display: flex;
  flex-direction: column;
  .svg{
    flex: auto;
    display: flex;
  }
}
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
