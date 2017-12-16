<template>
  <div class="wh100 task-record">
    <el-container class="wh100">
      <el-aside class="task-record-menu" width="224px">
        <task-menu ref="menu" :menuData="menuData" :id.sync="nowId" :structureId.sync="structureId" @add="add" @edit="edit" @down="down" @del="del"
          @save="save" @cancel="cancel" />
      </el-aside>
      <el-main class="task-record-main">
        <h1 v-if="!nowData">没有数据</h1>
        <el-tabs v-if="nowData">
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
        <div class="tpl" v-if="nowData && nowData.id !== ''">
          <el-button type="success" style="height:40px;" @click="tplState = true">创建为模板</el-button>
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

  const baseData = { // 张拉数据
    id: '',
    bridgeName: '梁号',
    holeId: '',
    deviceId: '', // 设备id 未张拉使用全局的设备 已张拉使用用户下的设备
    steelStrandId: '', // 钢绞线id 未张拉使用全局的钢绞线 已张拉使用用户下的钢绞线
    concretes: { // 混凝土数据
      sampleNumber: '试块编号',
      sampleStrength: '试块强度',
      designStrength: '设计强度',
      tensioningStrengthNow: '张拉时强度',
      castingDate: '浇筑日期',
    },
    data: null,
  };
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
            return item.name;
          });
          this.nowGroupName = s[0];
          return s;
        } catch (error) {
          return null;
        }
      },
    },
    updated() {
      if (this.editState) {
        this.disabled(null);
      } else {
        this.disabled();
      }
    },
    data: () => ({
      role: false,
      nowData: null,
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
    }),
    watch: {
      // 切换菜单选项
      nowId(nval) {
        console.log(nval);
        if (nval !== null) {
          this.switchMenu();
        } else if (!this.editState) {
          this.nowData = null;
        }
      },
      // 张拉组切换
      nowGroupName(nval) {
        if (nval) {
          this.taskData = this.nowData.data.filter(item => item.name === nval)[0];
        } else {
          this.taskData = null;
        }
      },
    },
    methods: {
      // 切换菜单
      switchMenu() {
        try {
          this.nowData = this.$unity.copyObj(
            window.tensioningDb.getCollection(this.structureId).findOne({
              id: this.nowId,
            }));
        } catch (error) {
          this.errorShow(`切换菜单--${error}`);
        }
      },
      add() {
        this.$message('添加');
        this.nowId = null;
        this.nowGroupName = null;
        this.nowData = this.$unity.copyObj(baseData);
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
            const collection = this.DB.getCollection('girder');
            const delData = collection.findOne({
              name: this.nowId,
            });
            collection.remove(delData);
            this.DB.save();
            this.nowId = null;
            this.getMenuData();
            this.$message('删除成功！');
          } catch (error) {
            this.errorShow(`删除出错！${error}`);
          }
        });
      },
      save() {
        this.$message('保存');
        const db = window.tensioningDb;
        const cname = this.structureId;
        let cstate = true;
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
        const nowData = this.nowData;
        let msg = '添加成功！';
        let errorMsg = '数据插入出错！';
        try {
          // 添加
          if (this.addState) {
            // 判断数据是否存在
            if (cstate && collection.findOne({
              bridgeName: nowData.bridgeName,
            })) {
              this.$message.error('该梁号已经存在！请重新输入！');
              return;
            }
            nowData.id = this.$unity.timeId();
            collection.insert(nowData);
            db.save();
            this.$refs.menu.showMenu(cname, nowData.id);
          } else { // 修改
            msg = '修改成功！';
            errorMsg = '数据更新出错！';
            collection.update(nowData);
            db.save();
          }
          // 通知菜单更新
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
          const tplName = `${this.tplName}-${this.structureId}`;
          const db = window.tensioningDb;
          // 获取文档
          const collection = db.getCollection('tpl');
          console.log(collection);
          // 判断数据是否存在
          if (collection.findOne({ tplName: tplName })) {
            this.$message.error('模板已经存在！请重新输入！');
          } else {
            collection.insert({
              tplName: tplName,
              structureId: this.structureId,
              data: this.$unity.copyObj(this.nowData),
            });
            db.save();
            this.$message.success('模板保存成功！');
            this.plState = false;
          }
        } else {
          this.$message.error('必须输入模板名称！');
        }
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
</style>
