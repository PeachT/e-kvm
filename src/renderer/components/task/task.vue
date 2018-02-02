<template>
  <div class="wh100 task-record" ref="task">
    <el-container class="wh100">
      <el-aside class="task-record-menu" width="224px">
        <task-menu ref="menu" :menuData="menuData" :childrenMenuData="childrenMenuData" :childrenMenuId.sync="childrenMenuId" :menuId.sync="menuId"
        @add="add" @edit="edit" @down="down" @del="del" @save="save" @cancel="cancel" :pgNo.sync="pgNo" :paNoLength="paNoLength"/>
      </el-aside>
      <el-main class="task-record-main">
        <h1 v-show="!nowDataState">没有数据</h1>
        <el-tabs v-if="nowDataState">
          <el-tab-pane label="基础信息">
            <div ref="top">
              <base-top
                :holeId.sync="nowData.holeId"
                :structureId.sync="structureId"
                :deviceId.sync="nowData.deviceId"
                :bridgeName.sync="nowData.bridgeName"
                :steelStrandId.sync="nowData.steelStrandId"
                :data.sync="nowData.data"
                :editState="editState" />
            </div>
            <div ref="group">
              <base-group :groups="groups" :nowGroupName.sync="nowGroupName" v-if="groups" />
            </div>
            <div ref="tendon">
              <base-tendon-data :taskData.sync="taskData" :deviceId="nowData.deviceId" v-if="nowGroupName" />
            </div>
            <!-- 记录 -->
            <div v-if="taskData && 'curves' in taskData">
              <div ref="record">
                <base-record-data :taskData.sync="taskData" :deviceId="nowData.deviceId"/>
              </div>
              <base-svg
                h="500"
                :data="taskData.curves"
                :time="{start: taskData.recird.startDate, end: taskData.recird.endDate}"
                :tensioningPattern="taskData.tensioningPattern"
                refName="Mpa"/>
                <br>
              <base-svg
                h="500"
                :data="taskData.curves"
                :time="{start: taskData.recird.startDate, end: taskData.recird.endDate}"
                :tensioningPattern="taskData.tensioningPattern"
                refName="mm"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设备消息">
            <div ref="deviceInfo">
              <device-info :deviceId="nowData.deviceId" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="钢绞线/混泥土">
            <div ref="otherInfo">
              <other-info :steelStrandId="nowData.steelStrandId" :concretes.sync="nowData.concretes" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户信息">
            <div ref="userInfo">
              <user-info />
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="tpl" v-if="!editState && nowDataState && nowData.id">
          <el-button plain round style="height:40px;" @click="excel()">导出Excel</el-button>
          <el-button
            :type="taskDown.type"
            plain round
            style="height:40px;"
            @click="taskDownFunc(taskDown.state)"
            >{{taskDown.title}}</el-button>
          <el-button plain round style="height:40px;" @click="newTaskState = true">创建新任务</el-button>
        </div>
      </el-main>
    </el-container>
    <el-dialog title="创建新任务" :visible.sync="newTaskState" width="60%" >
      <div >
        <el-form label-width="120px">
          <el-form-item label="梁号" prop="name">
            <el-input v-model="newTaskName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tplCreateFunc()">完 成</el-button>
      </span>
    </el-dialog>
    <!-- <tpl-select v-if="tplSelectState" :show.sync="tplSelectState" @addOk="addOk" @cancel="cancel"/> -->
    <!-- 下载任务 -->
    <el-dialog
      title="任务下载中..."
      :visible="taskDownData.state"
      width="60%"
      >
      <div class="taskDownData">
        <h3>设备连接状态</h3>
        <div :class="{'yes': PLCState1}" v-show="taskDownData.plc1"><i class="el-icon-success"></i>主站</div>
        <div :class="{'yes': PLCState2}" v-show="taskDownData.plc2"><i class="el-icon-success"></i>从站</div>
        <div :class="{'yes': !currentlyS.p1A}" ><i class="el-icon-success"></i>A1报警</div>
        <div :class="{'yes': !currentlyS.p1B}" ><i class="el-icon-success"></i>B1报警</div>
        <div :class="{'yes': !currentlyS.p2A}" ><i class="el-icon-success"></i>A2报警</div>
        <div :class="{'yes': !currentlyS.p2B}" ><i class="el-icon-success"></i>B2报警</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="taskDownData.state = false">取 消</el-button>
        <el-button @click="taskDownFunc(taskDown.state)">重新下载</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import BaseTop from '../task_record_template/base/baseTop.vue';
  import BaseGroup from '../task_record_template/base/baseGroup.vue';
  import BaseTendonData from '../task_record_template/base/baseTendonData.vue';
  import OtherInfo from '../task_record_template/otherInfo.vue';
  import TaskMenu from '../menus/menuOne.vue';
  import DeviceInfo from '../task_record_template/deviceInfo.vue';
  import UserInfo from '../user/template/userInfo.vue';
  import TplSelect from './tplSelect/tplSelect.vue';

  // import BaseRecordData from '../task_record_template/base/baseRecordData.vue';
  import D3SvgLoading from '../task_record_template/base/d3SvgLoading.vue';
  import { POINT_CONVERSION_COMPRESSED } from 'constants';
  // import BaseSvg from '../task_record_template/d3svg';

  const BaseSvg = () => ({
  // 需要加载的组件。应当是一个 Promise
    component: import('../task_record_template/d3svg'),
    // component: new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(import('../task_record_template/d3svg'))
    //     // reject()
    //   }, 2000)
    // }),
    // 加载中应当渲染的组件
    loading: D3SvgLoading,
    // 出错时渲染的组件
    error: D3SvgLoading,
    // 渲染加载中组件前的等待时间。默认：200ms。
    delay: 200,
    // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
    timeout: 5000,
  });
  const BaseRecordData = () => ({
    component: import('../task_record_template/base/baseRecordData.vue'),
    loading: D3SvgLoading,
    error: D3SvgLoading,
    delay: 200,
    timeout: 8000,
  });

  const baseData = { // 张拉数据
    id: null,
    bridgeName: null, // 梁号
    holeId: null,
    deviceId: null, // 设备id 未张拉使用全局的设备 已张拉使用用户下的设备
    steelStrandId: null, // 钢绞线id 未张拉使用全局的钢绞线 已张拉使用用户下的钢绞线
    state: 0, // 张拉状态
    concretes: { // 混凝土数据
      sampleNumber: null, // '试块编号',
      sampleStrength: null, // '试块强度',
      designStrength: null, // '设计强度',
      tensioningStrengthNow: null, // '张拉时强度',
      castingDate: null, // '浇筑日期',
    },
    data: null,
  };
  const taskDownData = {
    state: false,
    plc1: false,
    plc2: false,
    dwon: false,
    A1: false,
    A2: false,
    B1: false,
    B2: false,
    A1show: false,
    A2show: false,
    B1show: false,
    B2show: false,
  };
  const taskData = {
    name: null, // 用 ‘/’ 号隔开A，B组张拉孔号 只有一个孔时不要‘/’号
    state: 0, // 张拉状态 0未张拉 1已张拉
    tensioningKN: 0, // 张拉控制应力
    steelStrandNumber: 0, // 钢绞线数量
    length: 0, // 张拉长度
    tensioningPattern: 0, // 0~4 依次 A1单顶 A两顶 B1单顶 B两顶 四顶
    two: false, // 二次张拉
    exceed: false, // 超张拉
    stage: 0, // 张拉阶段
    task: { // 任务数据
      A1: {
        LQ: 4, // 千斤顶工作段伸长量（LQ
        NS: 6, // 钢绞线内缩量均值（NS）
        LL: 125, // 理论伸长量(LL)
      },
      time: [], // 持荷时间
    },
    recird: { // 记录数据
      startDate: null, // 张拉时间
      endDate: null, // 张拉完成时间
      time: [], // 持荷时间
      A1: {
        Mpa: [], // 压力
        mm: [], // 位移
        initMpa: [], // 回到初张拉压力
        initMM: [], // 回到初张拉位移
        retractionMM: 8, // 力筋回缩量
        LZ: 128, // 总伸长量（LZ）
        deviation: 0.5, // 偏差率
      },
      A2: {
        Mpa: [], // 压力
        mm: [], // 位移
        initMpa: [], // 回到初张拉压力
        initMM: [], // 回到初张拉位移
        retractionMM: 8, // 力筋回缩量
      },
      B1: {
        Mpa: [], // 压力
        mm: [], // 位移
        initMpa: [], // 回到初张拉压力
        initMM: [], // 回到初张拉位移
        retractionMM: 8, // 力筋回缩量
        LZ: 128, // 总伸长量（LZ）
        deviation: 0.5, // 偏差率
      },
      B2: {
        Mpa: [], // 压力
        mm: [], // 位移
        initMpa: [], // 回到初张拉压力
        initMM: [], // 回到初张拉位移
        retractionMM: 8, // 力筋回缩量
      },
    },
    curves: [ // 曲线
      {
        time: [],
        A1Mpa: [],
        A2Mpa: [],
        B1Mpa: [],
        B2Mpa: [],
        A1mm: [],
        A2mm: [],
        B1mm: [],
        B2mm: [],
      },
    ],
  };
  const pressurePLC = require('../../objJS/matrixing').default.pressurePLC;
  const ejsExcel = require('../../ejsExcel/ejsExcel').default.ex;
  export default {
    name: 'task',
    components: {
      TaskMenu,
      DeviceInfo,
      OtherInfo,
      UserInfo,
      TplSelect,
      D3SvgLoading,
      BaseTop,
      BaseTop,
      BaseTendonData,
      BaseGroup,
      BaseRecordData,
      BaseSvg,
    },
    computed: {
      // 编辑状态
      editState() {
        return this.$store.state.global.editState;
      },
      addState() {
        return this.$store.state.global.addState;
      },
      groups() {
        try {
          const s = this.nowData.data.map((item) => {
            return { name: item.name, state: item.state };
          });
          this.nowGroupName = s[0].name;
          return s;
        } catch (error) {
          return null;
        }
      },
      PLCState1() {
        return this.$store.state.global.PLC1State;
      },
      PLCState2() {
        return this.$store.state.global.PLC2State;
      },
      PLC550() {
        return {
          p1: this.$store.state.global.PLC1550,
          p2: this.$store.state.global.PLC2550,
        };
      },
      currentlyS() {
        const p1 = this.$store.state.global.PLC1S;
        const p2 = this.$store.state.global.PLC2S;
        return {
          p1A: p1.A !== 0,
          p1B: p1.B !== 0,
          p2A: p2.A !== 0,
          p2B: p2.B !== 0,
          p: p1.A !== 0 || p1.B !== 0 || p2.A !== 0 || p2.B !== 0,
        };
      },
    },
    beforeMount() {
      this.getMenuData();
    },
    beforeUpdate() {
      console.time('c');
    },
    updated() {
      if (this.editState) {
        this.disabled(null);
      } else {
        this.disabled();
      }
    },
    data: () => ({
      MpaShow: false,
      mmShow: false,
      //手动分组
      manualDeviceState: false,
      // 创建为新任务
      newTaskName: null,
      // 梁数据
      nowData: {
        bridgeName: '',
        holeId: '',
        deviceId: '',
        steelStrandId: '',
        state: 0,
        concretes: {
          sampleNumber: null,
          sampleStrength: null,
          designStrength: null,
          tensioningStrengthNow: null,
          castingDate: '',
        },
      },
      // 孔数据
      taskData: null,
      // 孔张拉状态
      taskDown: {
        state: null,
        title: null,
        type: null,
      },
      // 加载数据
      pgNo: 0,
      paNoLength: false,
      role: false,
      nowDataState: false,
      menuId: null,
      childrenMenuData: null,
      childrenMenuId: null,
      nowDataRules: {
        name: [{
          required: true,
          message: '请输入构件名称',
          trigger: 'blur',
        },
        {
          min: 1,
          max: 15,
          message: '长度在 1 到 15 个字符',
          trigger: 'blur',
        }],
      },
      menuData: null,
      nowGroupName: null,
      structureId: null,
      tplName: null,
      svg1: null,
      svg2: null,
      newTaskState: false,
      taskDownData: taskDownData,
    }),
    watch: {
      pgNo(nval) {
        console.log(nval);
        this.getChildrenMenuData();
      },
      nowData(nval) {
        if (nval) {
          this.nowDataState = true;
        } else {
          this.nowDataState = false;
        }
      },
      // 张拉组切换
      nowGroupName(nval) {
        if (nval) {
          this.taskData = this.nowData.data.filter(item => item.name === nval)[0];
          const state = this.groups.filter(item => item.name === this.nowGroupName)[0].state;
          const titles = ['张  拉', '重新张拉', '二次张拉', '继续张拉'];
          const types = ['primary', 'danger', 'warning', 'danger'];
          this.taskDown = {
            state: state,
            title: titles[state],
            type: types[state],
          };
          // this.newTaskName = this.taskData.bridgeName;
        }
      },
      menuId(nval) {
        if (nval) {
          this.getMenuData();
          if (this.childrenMenuId === null) {
            this.getChildrenMenuData();
          }
        } else if (!this.editState) {
          this.nowDataState = false;
          // this.nowData = null;
        }
      },
      childrenMenuId(nval) {
        this.getChildrenMenuData();
      },
    },
    methods: {
      // 主菜单数据获取
      getMenuData() {
        console.time('b');
        try {
          const ids = [];
          window.tensioningDB.collections.map((item) => {
            if (item.name !== 'tpl' && item.name !== 'device') {
              ids.push(item.name);
            }
            return null;
          });
          let menuData = [];
          if (ids.length > 0) {
            menuData = window.girderDB.get({
              id: {
                $in: ids,
              },
            }).map((item) => {
              return {
                name: item.name,
                id: item.id,
              };
            });
          }
          if (this.menuId) {
            this.getChildrenMenuData();
          } else {
            this.nowDataState = false;
          }
          this.menuData = menuData;
        } catch (error) {}
        console.timeEnd('b');
      },
      // 子菜单切换
      getChildrenMenuData() {
        console.time('a');
        this.nowGroupName = null;
        try {
          const datass = window.tensioningDB.getCollection(this.menuId).chain().find()
            .sort((o1, o2) => {
              return o1.$loki > o2.$loki ? -1 : 1;
            })
            .data();
          this.paNoLength = datass.length > 75 && true;
          let datas = [];
          if (75 + this.pgNo > datass.length && datass.length > 75) {
            this.pgNo = datass.length - 75;
            datas = datass.slice(this.pgNo, datass.length);
          } else {
            datas = datass.slice(this.pgNo, 75 + this.pgNo);
          }
          this.childrenMenuData = datas.map((item) => {
            return {
              name: item.bridgeName,
              id: item.id,
              state: item.state,
            };
          });
          // datass.reverse();
          const id = this.childrenMenuId;
          if (this.menuId && id === null) {
            this.childrenMenuId = this.childrenMenuData[0].id;
          }
          if (id) {
            this.nowData = this.$unity.copyObj(datas.filter(item => item.id === id)[0]);
            this.newTaskName = this.nowData.bridgeName;
            window.deviceId = this.nowData.deviceId;
          }
        } catch (error) {}
        console.timeEnd('a');
      },
      // 保存取消切换菜单
      showMenu(menuId, childrenMenuId) {
        this.menuId = menuId;
        this.childrenMenuId = childrenMenuId;
      },
      add() {
        this.$message('添加');
        this.nowData = this.$unity.copyObj(baseData);
        this.taskData = null;
        this.nowGroupName = null;
        this.structureId = null;
      },
      addOk() {
        this.nowDataState = true;
        this.$store.commit('addState', true);
        this.$store.commit('editState', true);
        this.menuId = null;
        this.childrenMenuId = null;
        this.nowGroupName = null;
        const data = this.$unity.copyObj(this.nowData);
        data.bridgeName = this.newTaskName;
        data.id = null;
        delete data.meta;
        delete data.$loki;
        data.data.forEach((item) => {
          delete item.recird;
          delete item.curves;
          item.state = 0;
        });
        this.nowData = data;
        this.newTaskState = false;
        console.log(this.nowData, data);
      },
      edit() {
        this.$message('编辑');
      },
      down() {
        this.$message('下载');
      },
      del() {
        this.$confirm('您确定删除该成员吗？', '危险警告！', {
          confirmButtonText: '取消',
          cancelButtonText: '继续删除',
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'info',
            message: '取消删除！',
          });
        }).catch(() => {
          try {
            const db = window.tensioningDB;
            db.getCollection(this.structureId)
              .chain().find({ id: this.nowData.id }).remove();
            db.save();
            this.childrenMenuId = null;
            this.getChildrenMenuData();
            this.$message('删除成功！');
          } catch (error) {
            this.errorShow(`删除出错！${error}`);
          }
        });
      },
      save() {
        this.$message('保存');
        const nowData = this.$unity.copyObj(this.nowData);
        console.log(nowData);
        const db = window.tensioningDB;
        const cname = this.structureId;
        let cstate = true;
        let msg = '添加成功！';
        let errorMsg = '数据插入出错！';
        // 获取构件文档
        let collection = db.getCollection(cname);
        // 构件文档不存在创建新的文档
        if (!collection) {
          collection = db.addCollection(cname, {
            indices: ['bridgeName', 'id'],
          });
          // 文档是否存在标示
          cstate = false;
        }
        try {
          // 添加
          if (this.addState) {
            if (cstate && collection.findOne({
              bridgeName: nowData.bridgeName,
            })) {
              this.$message.error('该梁号已经存在！请重新输入！');
              return;
            }
            nowData.id = this.$unity.timeId();
            collection.insert(nowData);
            db.save();
            // 通知菜单更新
            this.showMenu(cname, nowData.id);
          } else { // 修改
            msg = '修改成功！';
            errorMsg = '数据更新出错！';
            collection.update(nowData);
            db.save();
          }
          this.$message.success(msg);
          this.$store.commit('editState', false);
          this.$store.commit('addState', false);
        } catch (error) {
          this.errorShow(`${errorMsg}--${error}`);
        }
      },
      cancel() {
        const msg = this.addState ? '您确定要放弃添加梁数据吗？' : '您确定要放弃修改梁数据吗？';
        this.$confirm(msg, '提示', {
          confirmButtonText: '取消编辑',
          cancelButtonText: '继续编辑',
          type: 'warning',
        }).then(() => {
          this.$store.commit('editState', false);
          this.$store.commit('addState', false);
          this.nowData = null;
          this.taskData = null;
          this.getMenuData();
          this.$message({
            type: 'info',
            message: '已成功取消编辑!',
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '继续编辑',
          });
        });
      },
      errorShow(msg, title) {
        this.$notify.error({
          showClose: true,
          duration: 0,
          title: `错误--${title}`,
          message: msg,
        });
      },
      // 编辑禁止状态切换
      disabled(state = true) {
        const input = this.$refs.task;
        const top = this.$refs.top;
        const group = this.$refs.group;
        const tendon = this.$refs.tendon;
        const record = this.$refs.record;
        const deviceInfo = this.$refs.deviceInfo;
        const userInfo = this.$refs.userInfo;
        const otherInfo = this.$refs.otherInfo;
        this.$d3.select(top).selectAll('input').attr('disabled', state);
        this.$d3.select(group).selectAll('input').attr('disabled', null);
        this.$d3.select(tendon).selectAll('input').attr('disabled', state);
        this.$d3.select(record).selectAll('input').attr('disabled', true);
        this.$d3.select(deviceInfo).selectAll('input').attr('disabled', true);
        this.$d3.select(userInfo).selectAll('input').attr('disabled', true);
        this.$d3.select(otherInfo).selectAll('input').attr('disabled', state);

      },
      // 创建为新的任务
      tplCreateFunc() {
        this.addOk();
      },
      // 下载任务
      taskDownFunc(state) {
        this.taskDownData.state = true;
        const taskData = this.taskData;
        const tensioningPattern = taskData.tensioningPattern; // 泵顶组合
        let b = false;
        console.log(this.currentlyS);
        switch (tensioningPattern) {
          case 0:
            this.taskDownData.plc1 = true;
            if (!this.PLCState1 || this.currentlyS.p1A) {
              this.$message.error('设备连接有误！');
              b = true;
            }
            break;
          case 2:
            this.taskDownData.plc2 = true;
            if (!this.PLCState2 || this.currentlyS.p2B) {
              this.$message.error('设备连接有误！');
              b = true;
            }
            break;
          case 1:
            this.taskDownData.plc1 = true;
            this.taskDownData.plc2 = true;
            if ((!this.PLCState1 && !this.PLCState2) || this.currentlyS.p1A || this.currentlyS.p2A) {
              this.$message.error('设备连接有误！');
              b = true;
            }
            break;
          case 3:
            this.taskDownData.plc1 = true;
            this.taskDownData.plc2 = true;
            if ((!this.PLCState1 && !this.PLCState2) || this.currentlyS.p1B || this.currentlyS.p2B) {
              this.$message.error('设备连接有误！');
              b = true;
            }
            break;
          case 4:
            this.taskDownData.plc1 = true;
            this.taskDownData.plc2 = true;
            if ((!this.PLCState1 && !this.PLCState2) || this.currentlyS.p) {
              this.$message.error('设备连接有误！');
              b = true;
            }
            break;
          default:
            break;
        }
        if (!b) {
          try {
            window.nowDB.c.chain().find().remove();
            window.nowDB.db.save();
          } catch (error) {
            console.error(error);
          }
          this.taskDownData.dwon = true;
          window.nowDB.insert({
            uid: this.menuId,
            id: this.childrenMenuId,
            name: this.nowGroupName,
          });
          this.$router.push('/monitoring');
          this.taskDownData.state = false;
          console.log(this.taskDownData);
        }
      },
      // 导出Excel
      excel() {
        ejsExcel();
      },
    },
  };

</script>

<style lang="scss" scoped>
.tpl {
  position: absolute;
  top: 0;
  right: 1px;
}
.taskDownData{
  font-size: 26px;
  div{
    margin: 10px;
  }
  .yes{
    color:#67C23A;
  }
}
</style>
