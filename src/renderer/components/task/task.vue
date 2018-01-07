<template>
  <div class="wh100 task-record">
    <el-container class="wh100">
      <el-aside class="task-record-menu" width="224px">
        <task-menu ref="menu" :menuData="menuData" :childrenMenuData="childrenMenuData" :childrenMenuId.sync="childrenMenuId" :menuId.sync="menuId"
        @add="add" @edit="edit" @down="down" @del="del" @save="save" @cancel="cancel" :pgNo.sync="pgNo" :paNoLength="paNoLength"/>
      </el-aside>
      <el-main class="task-record-main">
        <h1 v-if="!nowDataState">没有数据--{{touterPath}}</h1>
        <el-tabs v-show="nowDataState">
          <el-tab-pane label="基础信息">
            <base-top
            :holeId.sync="nowData.holeId"
            :structureId.sync="structureId"
            :deviceId.sync="nowData.deviceId"
            :bridgeName.sync="nowData.bridgeName"
            :steelStrandId.sync="nowData.steelStrandId"
            :data.sync="nowData.data"
            :editState="editState" />
            <base-group :groups="groups" :nowGroupName.sync="nowGroupName" v-if="groups" />
            <base-tendon-data :taskData.sync="taskData" :deviceId="nowData.deviceId" v-if="taskData" />
            <div v-if="touterPath === '记录' && nowDataState">
              <base-record-data />
              <!-- <d3-svg-loading/> -->
              <base-svg :data="svg1" refName="svg1"/>
              <base-svg :data="svg2" refName="svg2"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设备消息">
            <device-info :deviceId="nowData.deviceId" />
          </el-tab-pane>
          <el-tab-pane label="钢绞线/混泥土">
            <other-info :steelStrandId="nowData.steelStrandId" />
          </el-tab-pane>
          <el-tab-pane label="用户信息">
            <user-info />
          </el-tab-pane>
        </el-tabs>
        <div class="tpl" v-if="nowDataState && nowData.id !== ''">
          <el-button :type="taskDown.type" plain round style="height:40px;" @click="taskDownFunc(taskDown.state)">{{taskDown.title}}</el-button>
          <el-button plain round style="height:40px;" @click="tplState = true">创建为模板</el-button>
        </div>
      </el-main>
    </el-container>
    <el-dialog title="创建模板" :visible.sync="tplState" width="60%" >
      <div >
        <el-form label-width="120px">
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="tplName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tplCreateFunc">完 成</el-button>
      </span>
    </el-dialog>
    <tpl-select v-if="tplSelectState" :show.sync="tplSelectState" @addOk="addOk" @cancel="cancel"/>
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
        <h3>数据下载状态</h3>
        <div :class="{'yes': taskDownData.A1}" v-show="taskDownData.A1show"><i :class="{'el-icon-success' : taskDownData.A1, 'el-icon-loading': !taskDownData.A1}"></i>{{taskDownData.A1? '下载完成': '下载中...'}}</div>
        <div :class="{'yes': taskDownData.A2}" v-show="taskDownData.A2show"><i :class="{'el-icon-success' : taskDownData.A2, 'el-icon-loading': !taskDownData.A2}"></i>{{taskDownData.A2? '下载完成': '下载中...'}}</div>
        <div :class="{'yes': taskDownData.B1}" v-show="taskDownData.B1show"><i :class="{'el-icon-success' : taskDownData.B1, 'el-icon-loading': !taskDownData.B1}"></i>{{taskDownData.B1? '下载完成': '下载中...'}}</div>
        <div :class="{'yes': taskDownData.B2}" v-show="taskDownData.B2show"><i :class="{'el-icon-success' : taskDownData.B2, 'el-icon-loading': !taskDownData.B2}"></i>{{taskDownData.B2? '下载完成': '下载中...'}}</div>
        <h3 :class="{'yes': taskDownDataAll}">{{taskDownDataAll? '全部下载完成！' : '下载中...'}}</h3>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
  // import BaseSvg from '../task_record_template/base/d3svg';
  // import BaseSvg from '../task_record_template/base/svg.vue';
  // import BaseSvg from '../task_record_template/base/veline.vue';
  // const BaseSvg = (resolve) => require('./service-search.vue', resolve);
  const BaseSvg = () => ({
  // 需要加载的组件。应当是一个 Promise
    component: import('../task_record_template/base/d3svg'),
    // 加载中应当渲染的组件
    loading: D3SvgLoading,
    // 出错时渲染的组件
    error: D3SvgLoading,
    // 渲染加载中组件前的等待时间。默认：200ms。
    delay: 500,
    // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
    timeout: 3000,
  });
  const BaseRecordData = () => ({
  // 需要加载的组件。应当是一个 Promise
    component: import('../task_record_template/base/baseRecordData.vue'),
    // 加载中应当渲染的组件
    loading: D3SvgLoading,
    // 出错时渲染的组件
    error: D3SvgLoading,
    // 渲染加载中组件前的等待时间。默认：200ms。
    delay: 500,
    // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
    timeout: 3000,
  });

  const baseData = { // 张拉数据
    id: '',
    bridgeName: '梁号',
    holeId: '',
    deviceId: '', // 设备id 未张拉使用全局的设备 已张拉使用用户下的设备
    steelStrandId: '', // 钢绞线id 未张拉使用全局的钢绞线 已张拉使用用户下的钢绞线
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
  const pressurePLC = require('../../objJS/matrixing').default.pressurePLC;
  export default {
    name: 'task',
    components: {
      TaskMenu,
      BaseTop,
      BaseGroup,
      BaseTendonData,
      DeviceInfo,
      OtherInfo,
      UserInfo,
      TplSelect,
      BaseRecordData,
      D3SvgLoading,
      BaseSvg,
    },
    computed: {
      //
      touterPath() {
        return this.$store.state.global.menuTitle;
      },
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
          console.log('张拉组数据改变', s[0]);
          this.nowGroupName = s[0].name;
          return s;
        } catch (error) {
          return null;
        }
      },
      taskDown() {
        const state = this.groups.filter(item => item.name === this.nowGroupName)[0].state;
        const titles = ['张  拉', '二次张拉', '重新张拉'];
        const types = ['primary', 'warning', 'danger'];
        return {
          state: state,
          title: titles[state],
          type: types[state],
        };
      },
      PLCState1() {
        return this.$store.state.global.PLC1State;
      },
      PLCState2() {
        return this.$store.state.global.PLC2State;
      },
      taskDownDataAll() {
        let s = false;
        if (taskDownData.dwon) {
          s = (taskDownData.A1show === taskDownData.A1) &&
          (taskDownData.A2show === taskDownData.A2) &&
          (taskDownData.B1show === taskDownData.B1) &&
          (taskDownData.B2show === taskDownData.B2);
        }
        if (s) {
          this.$message.success('下载完成');
          setTimeout(() => {
            this.taskDownData.state = false;
            this.taskDownData.plc1 = false;
            this.taskDownData.plc2 = false;
            this.taskDownData.dwon = false;
            this.taskDownData.A1 = false;
            this.taskDownData.A2 = false;
            this.taskDownData.B1 = false;
            this.taskDownData.B2 = false;
            this.taskDownData.A1show = false;
            this.taskDownData.A2show = false;
            this.taskDownData.B1show = false;
            this.taskDownData.B2show = false;
            this.$router.push('/monitoring');
          }, 100);
        }
        return s;
      },
    },
    beforeMount() {
      this.getMenuData();
      console.log(this.$store.state.global.menuTitle);
    },
    updated() {
      if (this.editState) {
        this.disabled(null);
      } else {
        this.disabled();
      }
    },
    data: () => ({
      pgNo: 0,
      paNoLength: false,
      role: false,
      nowData: baseData,
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
      nowId: null,
      nowGroupName: null,
      taskData: null,
      structureId: null,
      tplState: false,
      tplName: null,
      tplSelectState: false,
      svg1: null,
      svg2: null,
      taskDownData: taskDownData,
    }),
    watch: {
      pgNo(nval) {
        console.log(nval);
        this.getChildrenMenuData();
      },
      nowData() {
        this.nowDataState = true;
      },
      taskData() {
        console.log('数据变了');
        this.svg1 = this.svgData();
        this.svg2 = this.svgData(225);
      },
      // 张拉组切换
      nowGroupName(nval) {
        console.log(nval);
        if (nval) {
          this.taskData = this.nowData.data.filter(item => item.name === nval)[0];
          console.log(this.taskData);
        } else {
          this.taskData = null;
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
      // 曲线测试数据
      svgData(max = 60) {
        const arr = [[], [], [], []];
        for (let index = 0; index < 36; index += 1) {
          arr[0].push(Math.ceil(Math.random() * max));
          arr[1].push(Math.ceil(Math.random() * max));
          arr[2].push(Math.ceil(Math.random() * max));
          arr[3].push(Math.ceil(Math.random() * max));
        }
        return arr;
      },
      // 主菜单数据获取
      getMenuData() {
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
            // this.nowData = null;
          }
          this.menuData = menuData;
        } catch (error) {}
      },
      // 子菜单切换
      getChildrenMenuData() {
        try {
          // const datass = window.tensioningDB.getCollection(this.menuId).data;
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
          console.log('datas', datas, 'datass', this.childrenMenuData);
          const id = this.childrenMenuId;
          if (this.menuId && id === null) {
            this.childrenMenuId = this.childrenMenuData[0].id;
          }
          if (id) {
            this.nowData = this.$unity.copyObj(datas.filter(item => item.id === id)[0]);
          }
          console.log('子菜单', this.nowData);
        } catch (error) {}
      },
      // 保存取消切换菜单
      showMenu(menuId, childrenMenuId) {
        this.menuId = menuId;
        this.childrenMenuId = childrenMenuId;
      },
      add() {
        this.$message('添加');
        this.tplSelectState = true;
      },
      addOk(data = false, structureId) {
        this.menuId = null;
        this.childrenMenuId = null;
        this.nowGroupName = null;
        if (data) {
          this.structureId = structureId;
          delete data.meta;
          delete data.$loki;
          this.nowData = data;
        } else {
          this.nowData = this.$unity.copyObj(baseData);
        }
        this.tplSelectState = false;
        console.log(this.nowData);
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
            // 判断数据是否存在
            // for (let index = 0; index < 100; index += 1) {
            //   console.log(index);
            //   nowData.bridgeName = `梁${index}t`;
            //   if (cstate && collection.findOne({
            //     bridgeName: nowData.bridgeName,
            //   })) {
            //     this.$message.error('该梁号已经存在！请重新输入！');
            //     return;
            //   }
            //   nowData.id = `${this.$unity.timeId()}${index}`;
            //   // nowData.id = this.$unity.timeId();
            //   collection.insert(this.$unity.copyObj(nowData));
            //   db.save();
            // }
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
      errorShow(msg) {
        this.$notify.error({
          showClose: true,
          duration: 0,
          title: '错误',
          message: msg,
        });
      },
      // 编辑禁止状态切换
      disabled(state = true) {
        // this.$d3.selectAll('input').attr('disabled', state);
      },
      // 创建模板
      tplCreateFunc() {
        if (this.tplName) {
          const name = `${this.tplName}-${this.menuId}`;
          const data = this.$unity.copyObj(this.nowData);
          data.bridgeName = '';
          const tplData = {
            name: name,
            id: this.$unity.timeId(),
            structureId: this.menuId,
            data: data,
          };
          if (window.tplDB.insert(tplData, { name: name })) {
            this.$message.error('模板已经存在！请重新输入！');
            return;
          }
          this.$message.success('模板保存成功！');
          this.tplState = false;
        } else {
          this.$message.error('必须输入模板名称！');
        }
      },
      // 下载任务
      taskDownFunc(state) {
        try {
          window.nowDB.c.chain().find().remove();
          // $db.save();
          window.nowDB.db.save();
        } catch (error) {
          console.error(error);
        }
        const taskData = this.taskData;
        const tensioningPattern = taskData.tensioningPattern; // 泵顶组合
        switch (tensioningPattern) {
          case 0:
            this.taskDownData.plc1 = true;
            if (!this.PLCState1) {
              this.$message.error('设备连接有误！');
              return;
            }
            break;
          case 2:
            this.taskDownData.plc2 = true;
            if (!this.PLCState2) {
              this.$message.error('设备连接有误！');
              return;
            }
            break;
          case 1:
          case 3:
          case 4:
            this.taskDownData.plc1 = true;
            this.taskDownData.plc2 = true;
            if (!this.PLCState && !this.PLCState2) {
              this.$message.error('设备连接有误！');
              return;
            }
            break;
          default:
            break;
        }
        this.taskDownData.state = true;
        const pressure = pressurePLC(taskData, this.nowData.deviceId);
        if ('A1' in pressure) {
          this.taskDownData.A1show = true;
          this.$plc1.writeSingleRegister16(4096, pressure.A1[0], (data) => {
            this.taskDownData.A1 = true;
          });
        }
        if ('A2' in pressure) {
          this.taskDownData.A2show = true;
          this.$plc2.writeSingleRegister16(4096, pressure.A1[0], (data) => {
            this.taskDownData.A2 = true;
          });
        }
        if ('B1' in pressure) {
          this.taskDownData.B1show = true;
          this.$plc1.writeSingleRegister16(4196, pressure.A1[0], (data) => {
            this.taskDownData.B1 = true;
          });
        }
        if ('B2' in pressure) {
          this.taskDownData.B2show = true;
          this.$plc2.writeSingleRegister16(4196, pressure.A1[0], (data) => {
            this.taskDownData.B2 = true;
          });
        }
        this.taskDownData.dwon = true;
        window.nowDB.insert({
          uid: this.menuId,
          id: this.childrenMenuId,
          name: this.nowGroupName,
          pressure: pressure,
        });
        console.log(this.taskDownData);
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
