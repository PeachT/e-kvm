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
              <th>顶/张拉位移</th>
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
              <td>{{currentlyData[`${item}mm0`] | plc2mm(item)}}/{{currentlyData[`${item}mm`] | plc2mm(item)}}</td>
              <td>{{currentlyData[`${item}mpa`] | plc2mpa(item)}}</td>
              <td>{{pressure.stagesMpa[item][PLCStage]}}</td>
              <td>{{LZ[`${item}dmm`]}}</td>
              <template v-if="item === 'A1' || item === 'B1'">
                <td rowspan="2">{{LZ[`${item}deviation`]}}</td>
                <td rowspan="2">{{nowData.task[item].LL}}</td>
                <td rowspan="2">{{LZ[item].mm}}</td>
                <td rowspan="2">{{LZ[item].deviation}}</td>
              </template>
            </tr>
          </table>
        </div>
        <div class="auto svg" ref="devSvg">
          <curves-svg
            v-if="svgh"
            :h="svgh"
            ref="mpaCurves"
            :data="curves"
            :time="{start: recird.startDate, end: recird.endDate}"
            :tensioningPattern="nowData.tensioningPattern"
            refName="Mpa"/>
          <curves-svg
            v-if="svgh"
            :h="svgh"
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
      top="30%"
      >
      <div>
        可以张拉
        <el-form label-width="85">
          <h3>混泥土信息</h3>
          <div class="row-flex">
            <el-form-item :label="item[1]"
              v-for="(item, index) in [['sampleNumber', '试块编号'], ['sampleStrength', '试块强度'], ['designStrength', '设计强度'],['tensioningStrengthNow','张拉时砼强度']]"
              :key="index">
              <el-input @focus="$unity.focusAllVal($event)" v-model="taskData.concretes[item[0]]"></el-input>
            </el-form-item>
            <el-form-item label="浇筑日期">
              <el-date-picker style="width:100%;" type="date" placeholder="选择日期" v-model="taskData.concretes.castingDate" @change="concretesFunc()"></el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <el-form label-width="85">
          <h3>张拉控制</h3>
          <div class="row-flex">
            <el-form-item label="张拉平衡">
              <el-input @focus="$unity.focusAllVal($event)" v-model.number="balance" type="number"></el-input>
            </el-form-item>
            <el-form-item label="补压系数">
              <el-select v-model="supMM" placeholder="补压系数">
                <el-option
                  v-for="item in [1, 0.99, 0.98, 0.97]"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row-flex">
            <el-form-item label="位移工作上限">
              <el-input-number
                v-model="WorkCeilingMM"
                :min="mmMin"
                :max="mmMax"
                type="number"
                @focus="$unity.focusAllVal($event)"></el-input-number>
              <!-- <el-input @focus="$unity.focusAllVal($event)" v-model.number="WorkCeilingMM" type="number"></el-input> -->
            </el-form-item>
            <el-form-item label="回顶位移下限">
              <el-input-number
                v-model="returnMM"
                :min="mmMin"
                :max="mmMax"
                type="number"
                @focus="$unity.focusAllVal($event)"></el-input-number>
            </el-form-item>
          </div>
        </el-form>
        <p>{{concretesState ? '请设置浇筑日期！' : '可以启动张拉'}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancel()">取消张拉</el-button>
        <el-button type="success" @click="startReady()">启动张拉</el-button>
      </span>
    </el-dialog>
    <!-- 暂停 -->
    <el-dialog
      title="暂停"
      :visible="pause"
      width="50%"
      top="30%"
      >
      <el-form label-width="85">
        <h3>张拉控制</h3>
        <div class="row-flex">
          <el-form-item label="张拉平衡">
            <el-input @focus="$unity.focusAllVal($event)" v-model.number="balance" type="number"></el-input>
          </el-form-item>
          <el-form-item label="补压系数">
            <el-select v-model="supMM" placeholder="补压系数">
              <el-option
                v-for="item in [1, 0.99, 0.98, 0.97]"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row-flex">
          <el-form-item label="位移工作上限">
            <el-input-number
              v-model="WorkCeilingMM"
              :min="mmMin"
              :max="mmMax"
              type="number"
              @focus="$unity.focusAllVal($event)"></el-input-number>
            <!-- <el-input @focus="$unity.focusAllVal($event)" v-model.number="WorkCeilingMM" type="number"></el-input> -->
          </el-form-item>
          <el-form-item label="回顶位移下限">
            <el-input-number
              v-model="returnMM"
              :min="mmMin"
              :max="mmMax"
              type="number"
              @focus="$unity.focusAllVal($event)"></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <p>{{currentlyS}}</p>
      <div v-if="bjs.length > 0">
        <div v-for="ab in stage" :key="ab" v-if="ab in bjs[bjs.length -1]">
          <div v-if="bjs[bjs.length -1][ab]" >
            <h1 :class="ab">{{ab}}</h1>
            <el-alert
              v-for="(item, index) in errorStr"
              :key="index"
              v-show="bjs[bjs.length -1][ab][index] == 1"
              :title="item[0]"
              :type="currentlyS ? 'error' : 'success'"
              :description="item[1]"
              :closable="false"
              show-icon>
            </el-alert>
          </div>
        </div>
        <div v-if="'p1' in bjs[bjs.length -1]">
          <el-alert
            title="主站手动暂停！"
            type="error"
            :closable="false"
            show-icon>
          </el-alert>
        </div>
        <div v-if="'p2' in bjs[bjs.length -1]">
          <el-alert
            title="从站手动暂停！"
            type="error"
            :closable="false"
            show-icon>
          </el-alert>
        </div>
      </div>
      <div>
        <el-alert
          v-if="!PLCState1"
          title="主站通常错误！"
          type="error"
          :closable="false"
          show-icon>
        </el-alert>
        <el-alert
          v-if="!PLCState2"
          title="从站通常错误！"
          type="error"
          :closable="false"
          show-icon>
        </el-alert>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="noExit()">不保存退出</el-button>
        <el-button type="warning" @click="pauseExit()">保存退出</el-button>
        <el-button type="success" @click="pauseRun()" v-show="pauseRunState">继续张拉</el-button>
      </span>
    </el-dialog>
    <!-- 超位移报警 -->
    <el-dialog
      title="超位移报警"
      :visible="exceedMMState"
      width="50%"
      top="30%"
      >
      <el-form label-width="85">
        <h3>张拉控制</h3>
        <div class="row-flex">
          <el-form-item label="张拉平衡">
            <el-input @focus="$unity.focusAllVal($event)" v-model.number="balance" type="number"></el-input>
          </el-form-item>
          <el-form-item label="补压系数">
            <el-select v-model="supMM" placeholder="补压系数">
              <el-option
                v-for="item in [1, 0.99, 0.98, 0.97]"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="row-flex">
          <el-form-item label="位移工作上限">
            <el-input-number
              v-model="WorkCeilingMM"
              :min="mmMin"
              :max="mmMax"
              type="number"
              @focus="$unity.focusAllVal($event)"></el-input-number>
            <!-- <el-input @focus="$unity.focusAllVal($event)" v-model.number="WorkCeilingMM" type="number"></el-input> -->
          </el-form-item>
          <el-form-item label="回顶位移下限">
            <el-input-number
              v-model="returnMM"
              :min="mmMin"
              :max="mmMax"
              type="number"
              @focus="$unity.focusAllVal($event)"></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <!-- <span>工作位移上限</span>
      <el-input @focus="$unity.focusAllVal($event)" v-model.number="WorkCeilingMM" type="number"></el-input> -->
      <!-- <span>回顶位移下限</span>
      <el-input @focus="$unity.focusAllVal($event)" v-model.number="returnMM" type="number"></el-input> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exceedReturn()" >回顶</el-button>
        <el-button type="success" @click="exceedRun()" :disabled="!exceedReturnMMState">继续张拉</el-button>
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
    supMM: 0.99, // 补压系数
    svgh: 0, // svgdom高度
    LZ: null, // 单顶伸长量，总伸长量，偏差率
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
    basenowData: null,
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
    tABNumber: 0,
    recird: { // 记录数据
    },
    curves: {
    },
    init: {
      A1mm: 0,
      A2mm: 0,
      B1mm: 0,
      B2mm: 0,
    },
    curvesTime1S: false, // 曲线实时采集
    unloadS: false, // 卸荷监控
    monitorMpaS: false, // 压力监控
    two: false, // 二次张拉
    repeatedly: false, // 多次张拉
    repeatedlyOK: false, // 多次张拉
    repeatedlyMpa: {
      A1: 0,
      A2: 0,
      B1: 0,
      B2: 0,
    }, // 多次张拉确认压力
    repeatedlyMM: {
      A1: 0,
      A2: 0,
      B1: 0,
      B2: 0,
    }, // 多次张拉确认位移
    repeatedlyA1: false,
    repeatedlyA2: false,
    repeatedlyB1: false,
    repeatedlyB2: false,
    exceedMMState: false, // 超位移
    pause: false, // 暂停
    // 压力到达确认
    sA1: false,
    sA2: false,
    sB1: false,
    sB2: false,
    // 张拉平衡
    balance: 5,
    balanceA1: false,
    balanceA2: false,
    balanceB1: false,
    balanceB2: false,
    // 位移工作上限
    mmMax: 0,
    WorkCeilingMM: 190,
    exceedReturnState: false, // 位移下限
    returnMM: 50, // 回顶位移
    mmMin: 50, // 位移下限
    exceedReturnMMState: false, // 回顶完成
    // 报警
    bj: {
      A1: null,
      A2: null,
      B1: null,
      B2: null,
    },
    bjs: [],
    errorStr: [
      ['超系统压力上限！', ''],
      ['超设置设置压力', ''],
      ['超系统位移上限！', ''],
      ['超系统位移下限', ''],
      ['位移未连接', ''],
      ['压力未连接', ''],
    ],
  }),
  mounted() {
    const svgMain = this.$refs.devSvg;
    this.svgh = svgMain.clientHeight;
  },
  beforeMount() {
    this.mmMax = parseInt(this.$UC.plc2mm(this.$store.state.global.systen.WorkCeilingMM));
    this.WorkCeilingMM = this.mmMax;
    this.mmMin = parseInt(this.$UC.plc2mm(this.$store.state.global.systen.WorkLowerMM));
    this.LZFunc();
    new Promise(this.ready0).then((val) => {
      console.log(val);
      return new Promise(this.DownPLC);
    }).then((val) => {
      console.log(val);
    });
  },
  watch: {
    // 极限报警
    currentlyS(nval) {
      if (nval) {
        const p1 = this.$store.state.global.PLC1S;
        const p2 = this.$store.state.global.PLC2S;
        const p = {
          A1: p1.A,
          B1: p1.B,
          A2: p2.A,
          B2: p2.B,
        };
        this.bjs.push(p);
      }
    },
    // 手动暂停
    p1550(nval) {
      if (nval) {
        if (!this.p2550 && !this.currentlyS) {
          this.bjs.push( {p1: true });
        }
        this.pauseFunc();
      }
    },
    p2550(nval) {
      const m = this.nowData.tensioningPattern; // 张拉模式
      if (nval && (m === 1 || m === 3 || m === 4)) {
        if (!this.p1550 && !this.currentlyS) {
          this.bjs.push( {p2: true });
        }
        this.pauseFunc();
      }
    },
    // 掉线
    PLCState1(nval) {
      if (!nval) {
        this.pauseFunc();
      }
    },
    PLCState2(nval) {
      const m = this.nowData.tensioningPattern; // 张拉模式
      if (!nval && (m === 1 || m === 3 || m === 4)) {
        this.pauseFunc();
      }
    },
    // 张拉平衡
    balanceA1(nval) {
      this.balanceOut('wPLC1', 2571, nval);
    },
    balanceA2(nval) {
      this.balanceOut('wPLC2', 2571, nval);
    },
    balanceB1(nval) {
      this.balanceOut('wPLC1', 2572, nval);
    },
    balanceB2(nval) {
      this.balanceOut('wPLC2', 2572, nval);
    },
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
        B1mpa: p1.B1mpa,
        A2mpa: p2.A2mpa,
        B2mpa: p2.B2mpa,
        A1mm: p1.A1mm - this.init.A1mm,
        A2mm: p2.A2mm - this.init.A2mm,
        B1mm: p1.B1mm - this.init.B1mm,
        B2mm: p2.B2mm - this.init.B2mm,
        A1mm0: p1.A1mm,
        A2mm0: p2.A2mm,
        B1mm0: p1.B1mm,
        B2mm0: p2.B2mm,

      };
      if (this.run && this.runT) {
        this.runT = false;
        setTimeout(() => {
          if (this.run && !this.pause) {
            this.runT = true;
            // 位移保存
            if (this.nowStage < this.stageStr.length - 1) {
              this.stage.forEach((item) => {
                this.mmSave(item, r);
                // 实时位移保存
              });
              this.LZFunc();
            }
            // 压力监控
            if (this.monitorMpaS) {
              new Promise(this.monitorMpa).then(() => {
                if (this.repeatedly && !this.repeatedlyOK) {
                  // 多次张拉压力监控
                  this.repeatedlyFunc();
                }
                // 超位移监控
                // this.stage.forEach((item) => {
                //   if (this.WorkCeilingMM < this.$UC.plc2mm(r[`${item}mm0`], item)) {
                //     this.exceedMM();
                //   }
                // });
                this.monitorMpaS = true;
              });
            } else if (this.unloadS) { // 卸荷监控
              new Promise(this.unloadFunc).then(() => {
                this.unloadS = true;
              });
            }
            // 实时曲线采集
            if (this.curvesTime1S) {
              new Promise(this.curvesTime1).then(() => {
                this.curvesTime1S = true;
              });
            }
          }
        }, 500);
      }
      // 回顶监控
      if (this.exceedReturnState) {
        this.exceedReturnMM(r);
      }
      return r;
    },
    // 一号暂停
    p1550() {
      return this.$store.state.global.PLC1550;
    },
    // 二号暂停
    p2550() {
      return this.$store.state.global.PLC2550;
    },
    // 继续张拉按钮
    pauseRunState() {
      try {
        const m = this.nowData.tensioningPattern; // 张拉模式
        if (m === 1 || m === 3 || m === 4) {
          if (this.PLCState2 && this.PLCState1 && !this.currentlyS) {
            return true;
          }
        } else if (this.PLCState1){
          return true;
        }
        return false;
      } catch (error) {

      }
    },
    // 报警
    currentlyS() {
      const p1 = this.$store.state.global.PLC1S;
      const p2 = this.$store.state.global.PLC2S;
      let b = false;
      if (p1.A || p1.B || p2.A || p2.B) {
        console.log('极限报警！！！');
        this.pauseFunc();
        b = true;
      }
      return b;
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
        // console.log('记录数据1', this.recird);
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
    // 准备张拉处理
    ready0(resolve, reject) {
      if (window.nowDB.getAll.length > 0) {
        if (!this.exceedMMState) {
          this.taskDownData.state = true;
        }
        if (this.nowData === null) {
          const uid = window.nowDB.getAll[0].uid; // 构件id
          this.girderName = window.girderDB.getOne({ id: uid }).name; // 获取构件名称
          const id = window.nowDB.getAll[0].id; // 梁id
          const name = window.nowDB.getAll[0].name; // 组名称
          this.taskData = window.tensioningDB.getCollection(uid).findOne({ id: id }); // 梁数据
          this.basenowData = this.taskData.data.filter(item => item.name === name)[0]; // 组数据
          this.nowData = this.$unity.copyObj(this.basenowData);
          this.pressure = pressurePLC(this.nowData, this.taskData.deviceId); // 数据换算
          this.two = this.nowData.two && this.nowData.state === 0; // 二次张拉
          this.repeatedly = this.nowData.state > 0; // 多次张拉
          this.stage = this.$Ounity.abModel(this.nowData.tensioningPattern); // 张拉模式
          this.stageStr = this.$Ounity.stage(this.nowData, true); // 张拉阶段
          window.deviceId = this.taskData.deviceId;
        } else {
          this.repeatedly = true;
        }
        if (!this.repeatedly) {
          const arrNull = [];
          // 记录数据结构
          this.nowData.task.time.forEach((item, index) => {
            arrNull.push(null);
          });
          this.recird.startDate = null;
          this.recird.endDate = null;
          this.recird.time = [...arrNull];
          this.stage.forEach((item) => {
            this.curves[`${item}Mpa`] = [];
            this.curves[`${item}mm`] = [];
            if (item === 'A1' || item === 'B1') {
              this.recird[item] = {
                Mpa: [], // 压力
                mm: [], // 位移
                initMpa: null, // 回到初张拉压力
                initMM: null, // 回到初张拉位移
                retractionMM: null, // 力筋回缩量
                LZ: null, // 总伸长量（LZ）
                deviation: null, // 偏差率
              };
            } else {
              this.recird[item] = {
                Mpa: [], // 压力
                mm: [], // 位移
                initMpa: null, // 回到初张拉压力
                initMM: null, // 回到初张拉位移
                retractionMM: null, // 力筋回缩量
              };
            }
          });
        } else { // 二次张拉
          this.recird = this.$unity.copyObj(this.nowData.recird);
          this.curves = this.$unity.copyObj(this.nowData.curves);
          let length = 0;
          this.stage.forEach((item) => {
            length = this.recird[item].Mpa.length - 1;
            this.repeatedlyMpa[item] = this.recird[item].Mpa[length];
          });
          this.PLCStage = length;
          this.nowStage = length + 1;
          this.mpaDownPLC(4510, this.repeatedlyMpa);
        }
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
      const zData = [0, 0, 0, 0]; // 下载到主站的数据
      const cData = [0, 0, 0, 0]; // 下载到从站的数据
      this.zDowm = false; // 主站下载完成标示
      this.cDowm = true; // 从站下载完成标示
      // 数据拼接
      this.stage.forEach((item) => {
        switch (item) {
          case 'A1':
            zData[0] = parseInt(mpas[item][stage] * this.supMM);
            zData[2] = mpas[item][stage];
            break;
          case 'B1':
            zData[1] = parseInt(mpas[item][stage] * this.supMM);
            zData[3] = mpas[item][stage];
            break;
          case 'A2':
            cData[0] = parseInt(mpas[item][stage] * this.supMM);
            cData[2] = mpas[item][stage];
            break;
          case 'B2':
            cData[1] = parseInt(mpas[item][stage] * this.supMM);
            cData[3] = mpas[item][stage];
            break;
          default:
            break;
        }
      });
      // 主站下载
      ipcRenderer.send('wPLC1', { func: 'writeMultipleRegisters16', address: 4504, data: zData, callback: dowmZC.z });
      ipcRenderer.on(dowmZC.z, (event, data) => {
        this.zDowm = true;
        if (this.zDowm && this.cDowm) {
          console.log(zData, cData);
          resolve('数据下载完成！');
        }
      });
      // 从站下载
      if (m === 1 || m === 3 || m === 4) {
        this.cDowm = false;
        ipcRenderer.send('wPLC2', { func: 'writeMultipleRegisters16', address: 4504, data: cData, callback: dowmZC.c });
        ipcRenderer.on(dowmZC.c, (event, data) => {
          this.cDowm = true;
          if (this.zDowm && this.cDowm) {
            console.log(zData, cData);
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
      // 判断多次张拉是否过初张拉
      if (this.repeatedly) {
        if (this.PLCStage === 0) {
          this.repeatedlyOK = true;
          this.mpaDownPLC(4510);
        } else {
          this.repeatedlyOK = false;
        }
      }
      this.run = true;
      this.taskDownData.state = false;
      console.log('123123213213213', this.nowStage);
      if (!this.nowStage) {
        this.nowStage = 1;
        this.currentlyState.A1 = 1;
        this.currentlyState.A2 = 1;
        this.currentlyState.B1 = 1;
        this.currentlyState.B2 = 1;
      }
      // 初始位移
      this.stage.forEach((item) => {
        this.init[`${item}mm`] = this.currentlyData[`${item}mm0`];
        this[`repeatedly${item}`] = false;
        this[`t2${item}`] = null;
        if (this.PLCStage === 0) {
          this.repeatedlyMM[item] = this.currentlyData[`${item}mm0`];
        }
      });
      // 保存开始时间
      if (this.recird.startDate === null) {
        this.recird.startDate = this.$unity.timeMs();
      }
      // this.mmBase = 1517279423116 1517279332008
      this.$message.success('开始张拉！！');
      new Promise((resolve, reject) => {
        this.stage.forEach((item) => {
          this.curves[`${item}Mpa`].push(this.currentlyData[`${item}mpa`]);
          this.curves[`${item}mm`].push(this.currentlyData[`${item}mm`]);
        });
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
      console.log('ssssss', this.taskData);
      // console.log('sssssss', this.recird.endDate, this.recird.startDate);
    },
    // 压力监控
    monitorMpa(resolve, reject) {
      this.monitorMpaS = false;
      const m = this.nowData.tensioningPattern; // 张拉模式
      const n = this.abStage.length - 1; // 单顶的状态
      const mpas = this.pressure.plcPressure; // 阶段压力
      const stage = this.PLCStage; // plc当前阶段
      this.stage.forEach((item) => {
        const setMpa = parseInt(mpas[item][stage] * this.supMM);
        console.log('压力', this.currentlyData[`${item}mpa`], setMpa);
        if (this.currentlyData[`${item}mpa`] >= setMpa) {
          if (!this[`t${item}`]) {
            this[`t${item}`] = setTimeout(() => {
              if (this.currentlyData[`${item}mpa`] >= setMpa) {
                this.currentlyState[item] = this.abStage.length - 2;
                this[`s${item}`] = true;
              } else{
                this[`t${item}`] = null;
              }
            }, 1500);
          }
        } else {
          if (this.WorkCeilingMM < this.$UC.plc2mm(this.currentlyData[`${item}mm0`], item)) {
            this.exceedMM();
          }
          clearTimeout(this[`t${item}`]);
          this[`t${item}`] = null;
        }
        let repeatedly =  true;
        if (this.repeatedly) {
          repeatedly = this.repeatedlyOK;
        }
        if (repeatedly && this.repeatedlyOK && this.balance !== 0 && !this.sA1 && !this.sA2 && !this.sB1 && !this.sB2) {
          let b = false;
          for (const item2 of this.stage) {
            if (this[`balance${item}`] && item !== item2 && this.LZ[`${item}dmm`] > this.LZ[`${item2}dmm`]) {
              b = true;
              break;
            } else if (!this[`balance${item}`] && (this.LZ[`${item}dmm`] - this.LZ[`${item2}dmm`]) > this.balance) {
              b = true;
              break;
            }
          }
          this[`balance${item}`] = b;
        } else {
          this[`balance${item}`] = false;
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
    // 多次张拉压力确认
    repeatedlyFunc(resolve, reject) {
      this.monitorMpaS = false;
      const m = this.nowData.tensioningPattern; // 张拉模式
      const n = this.abStage.length - 1; // 顶的状态
      const mpas = this.repeatedlyMpa; // 待确认压力
      let ok = true; // 全部确认完成
      this.stage.forEach((item) => {
        if (this.currentlyData[`${item}mpa`] >= mpas[item]) {
          if (!this[`t2${item}`]) {
            this[`t2${item}`] = setTimeout(() => {
              // this.currentlyState[item] = this.abStage.length - 2;
              if (this.currentlyData[`${item}mpa`] >= mpas[item]) {
                this.repeatedlyMM[item] = this.currentlyData[`${item}mm0`];
                this[`repeatedly${item}`] = true;
              } else{
                this[`t2${item}`] = null;
              }
            }, 5000);
          }
        } else {
          clearTimeout(this[`t2${item}`]);
          this[`t2${item}`] = null;
        }
        // 全部确认判断
        if (!this[`repeatedly${item}`] && ok) {
          ok = false;
        }
      });
      console.log('多次张拉监控', ok);
      if (ok) {
        this.repeatedlyOK = true;
        this.mpaDownPLC(4510);
      }
    },
    // 保压
    time() {
      window.setTimeout(() => {
        const PLCStage = this.PLCStage;
        if (!this.pause) {
          this.tABNumber += 1;
        }
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
      const PLCStage = this.PLCStage;
      // 下一阶段
      this.nowStage += 1;
      // 数据保存
      this.stage.forEach((item) => {
        this.mmSave(item);
        // 保压状态解除
        this[`s${item}`] = false;
        // 保压定时器清楚
        this[`t${item}`] = null;
        // 顶阶段
        this.currentlyState[`${item}`] = this.nowStage;
      });
      // 曲线保存
      this.Savecurves();
      // 下一阶段
      if (this.PLCStage < this.stageStr.length - 3) {
        this.PLCStage += 1;
        new Promise(this.DownPLC).then((val) => {
          console.log(val);
          this.monitorMpaS = true;
        }).catch(() => {
          console.error('下载错误');
        });
        // 张拉完成
      } else {
        this.allsuccessTime();
      }
    },
    // 全部保压完成
    allsuccessTime() {
      // 卸荷执行
      const m = this.nowData.tensioningPattern; // 张拉模式
      this.zUnload = false;
      this.cUnload = true;

      // 卸荷压力
      const zData = [0, 0]; // 下载到主站的数据
      const cData = [0, 0]; // 下载到从站的数据
      this.stage.forEach((item) => {
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
            console.log(item, '卸荷完成');
            if (this.currentlyData[`${item}mpa`] <= this.recird[item].Mpa[0]) {
              this[`unload${item}`] = true;
              this.recird[item].initMpa = this.currentlyData[`${item}mpa`];
              if (this.repeatedly) {
                this.recird[item].initMM = this.nowData.recird[item].mm[length] + (this.currentlyData[`${item}mm0`] - this.repeatedlyMM[item]);;
              } else {
                this.recird[item].initMM = this.currentlyData[`${item}mm`];
              }
            } else {
              clearTimeout(this[`tunload${item}`]);
            }
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
      setTimeout(() => {
        console.log('曲线保存');
        if (this.run && !this.pause) {
          this.Savecurves();
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
    // 超位移
    exceedMM() {
      this.exceedMMState = true;
      this.pause = true;
      ipcRenderer.send('wPLC1', { func: 'writeMultipleCoil', address: 2568, data: [0, 0] });
      const m = this.nowData.tensioningPattern; // 张拉模式
      if (m === 1 || m === 3 || m === 4) {
        ipcRenderer.send('wPLC2', { func: 'writeMultipleCoil', address: 2568, data: [0, 0] });
      }
    },
    // 超位移回顶
    exceedReturn() {
      if (!this.exceedReturnState) {
        this.successFunc();
        this.exceedReturnState = true;
      }
      this.stage.forEach((item) => {
        switch (item) {
          case 'A1':
            ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2089, data: true });
            break;
          case 'A2':
            ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2089, data: true });
            break;
          case 'B1':
            ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2099, data: true });
            break;
          case 'B2':
            ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2099, data: true });
            break;
          default:
            break;
        }
      });
    },
    // 超位移继续运行
    exceedRun() {
      this.runT = true;
      this.pause = false;
      this.exceedReturnState = false;
      this.exceedReturnMMState = false;
      ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2598, data: false });
      const m = this.nowData.tensioningPattern; // 张拉模式
      if (m === 1 || m === 3 || m === 4) {
        ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2598, data: false });
      }
      console.log('超位移继续运行');
      new Promise(this.ready0).then((val) => {
        console.log(val);
        return new Promise(this.DownPLC);
      }).then((val) => {
        console.log(val);
        this.startReady();
      });
      console.log('超位移继续运行2');
      this.exceedMMState = false;
    },
    // 超位移回顶监控
    exceedReturnMM(r) {
      let b = true;
      this.stage.forEach((item) => {
        if (this.$UC.plc2mm(r[`${item}mm0`], item) < this.returnMM + 2) {
          console.log('回顶监控', this.$UC.plc2mm(r[`${item}mm0`], item), this.returnMM);
          switch (item) {
            case 'A1':
              ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2089, data: false });
              break;
            case 'A2':
              ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2089, data: false });
              break;
            case 'B1':
              ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2099, data: false });
              break;
            case 'B2':
              ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2099, data: false });
              break;
            default:
              break;
          }
        } else {
          b = false;
        }
      });
      this.exceedReturnMMState = b;
    },
    // 完成数据保存
    successFunc() {
      // 张拉完成曲线定时器清除
      if (this.run) {
        this.recird.endDate = this.$unity.timeMs();
        this.run = false;
        this.Savecurves(); // 曲线保存
        this.nowData.recird = this.$unity.copyObj(this.recird); // 张拉数据
        this.nowData.curves = this.$unity.copyObj(this.curves); // 曲线数据
        if (this.exceedMMState || this.saveState) {
          this.nowData.state = 3; // 张拉状态 0未张拉 1张拉完成 2一次张拉完成 3张拉异常
        } else if (this.two) {
          this.nowData.state = 2; // 张拉状态 0未张拉 1张拉完成 2一次张拉完成 3张拉异常
        } else {
          this.nowData.state = 1;
        }
        if (!this.exceedMMState) {
          this.basenowData.recird = this.$unity.copyObj(this.nowData.recird);
          this.basenowData.curves = this.$unity.copyObj(this.nowData.curves);
          this.basenowData.state = this.$unity.copyObj(this.nowData.state);
          window.tensioningDB.getCollection(window.nowDB.getAll[0].uid).update(this.taskData);
          window.tensioningDB.save();
          console.log(this.basenowData, this.nowData);
          this.$message.success('数据保存完成');
        } else {
          this.$message.error('回顶数据保存完成！！！！！');
        }
        // 张拉完成跳转
        if (!this.exceedMMState || this.saveState) {
          this.$router.push('/menu');
          try {
            window.nowDB.c.chain().find().remove();
            // $db.save();
            window.nowDB.db.save();
          } catch (error) {
            console.error(error);
          }
          // 回顶
          ipcRenderer.send('wPLC1', { func: 'writeMultipleCoil', address: 2568, data: [0, 0] });
          ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2570, data: true });
          const m = this.nowData.tensioningPattern; // 张拉模式
          if (m === 1 || m === 3 || m === 4) {
            ipcRenderer.send('wPLC2', { func: 'writeMultipleCoil', address: 2568, data: [0, 0] });
            ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2570, data: true });
          }
        }
        console.log('wwwww', this.taskData);
      }
    },
    // 位移保存
    mmSave(item, currentlyData = null) {
      let r = currentlyData;
      if (currentlyData === null) {
        r = this.currentlyData;
      }
      if (this.repeatedly && this.repeatedlyOK) {
        this.recird[item].Mpa[this.PLCStage] = r[`${item}mpa`];
        const length = this.nowData.recird[item].mm.length - 1;
        const mm = this.nowData.recird[item].mm[length] + (r[`${item}mm0`] - this.repeatedlyMM[item]);
        this.recird[item].mm[this.PLCStage] = mm;
      } else if (!this.repeatedly) {
        this.recird[item].Mpa[this.PLCStage] = r[`${item}mpa`];
        this.recird[item].mm[this.PLCStage] = r[`${item}mm`];
      }
    },
    mpaDownPLC(address, mpas = null) {
      const m = this.nowData.tensioningPattern; // 张拉泵顶组合
      const zData = [0, 0]; // 下载到主站的数据
      const cData = [0, 0]; // 下载到从站的数据
      // 数据拼接
      if (mpas) {
        this.stage.forEach((item) => {
          switch (item) {
            case 'A1':
              zData[0] = mpas[item];
              break;
            case 'B1':
              zData[1] = mpas[item];
              break;
            case 'A2':
              cData[0] = mpas[item];
              break;
            case 'B2':
              cData[1] = mpas[item];
              break;
            default:
              break;
          }
        });
      }
      // 主站下载
      ipcRenderer.send('wPLC1', { func: 'writeMultipleRegisters16', address: address, data: zData });
      // 从站下载
      if (m === 1 || m === 3 || m === 4) {
        ipcRenderer.send('wPLC2', { func: 'writeMultipleRegisters16', address: address, data: cData });
      }
    },
    // 保存退出
    saveExit() {
      this.saveState = true;
      this.successFunc();
    },
    // 暂停
    pauseFunc() {
      this.pause = true;
      ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2598, data: true });
      const m = this.nowData.tensioningPattern; // 张拉模式
      if (m === 1 || m === 3 || m === 4) {
        ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2598, data: true });
      }
    },
    // 暂停继续
    pauseRun() {
      const nowStage = this.nowStage;
      const length = this.stageStr.length;
      console.log(nowStage, length)
      switch (true) {
        case nowStage < length - 1:
          new Promise(this.DownPLC).then((val) => {
            console.log(val);
          }).catch(() => {
            console.error('下载错误');
          });
          break;
        case nowStage === length - 1:
          this.allsuccessTime();
          break;
        default:
          break;
      }
      this.pause = false;
      this.runT = true;
      this.curvesTime();
      ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2598, data: false });
      const m = this.nowData.tensioningPattern; // 张拉模式
      if (m === 1 || m === 3 || m === 4) {
        ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2598, data: false });
      }
    },
    // 保存退出
    pauseExit() {
      this.saveExit();
    },
    // 平衡输出
    balanceOut(func, address, data = false) {
      ipcRenderer.send(func, { func: 'writeSingleCoil', address: address, data: data });
    },
    // noExit退出张拉
    noExit() {
      this.$alert('确定要放弃张拉？本次张拉数据将不保存！！', '取消张拉', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          this.cancel();
        }
      });
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
      ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2599, data: true });
      const m = this.nowData.tensioningPattern; // 张拉模式
      if (m === 1 || m === 3 || m === 4) {
        ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2599, data: true });
      }
      this.$router.push('/menu');
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
