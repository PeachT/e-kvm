<template>
  <div class="wh100 task-record">
    <el-container class="wh100">
      <el-aside class="task-record-menu" width="224px">
        <task-menu :menuData="menuData" :childrenMenuData="childrenMenuData" :childrenMenuId.sync="childrenMenuId" :menuId.sync="menuId"
        @add="add" @edit="edit" @down="down" @del="del" @save="save" @cancel="cancel" />
      </el-aside>
      <el-main class="task-record-main">
        <h1 v-if="!nowData">没有数据</h1>
        <el-tabs v-if="nowData">
          <el-tab-pane label="基础信息">
            <el-form class="form-info" label-width="90px">
              <el-form-item label="模板名称">
                <el-input v-model="tplName" >
                </el-input>
              </el-form-item>
            </el-form>
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
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import BaseTop from '../task_record_template/base/baseTop.vue';
  import BaseGroup from '../task_record_template/base/baseGroup.vue';
  import BaseTendonData from '../task_record_template/base/baseTendonData.vue';
  import OtherInfo from '../task_record_template/otherInfo.vue';
  import TaskMenu from '../menus/menuOne.vue';
  import DeviceInfo from '../task_record_template/deviceInfo.vue';

  const baseData = { // 张拉数据
    id: '',
    bridgeName: '梁号',
    holeId: '',
    deviceId: '', // 设备id 未张拉使用全局的设备 已张拉使用用户下的设备
    steelStrandId: '', // 钢绞线id 未张拉使用全局的钢绞线 已张拉使用用户下的钢绞线
    state: 0,
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
            return { name: item.name };
          });
          console.log('tpl分组', this.nowData.data, s);
          this.nowGroupName = s[0].name;
          return s;
        } catch (error) {
          return null;
        }
      },
    },
    beforeMount() {
      this.getMenuData();
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
      updata: null,
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
      taskData: null,
      structureId: null,
      tplState: false,
      tplName: null,
    }),
    watch: {
      // 张拉组切换
      nowGroupName(nval) {
        if (nval) {
          this.taskData = this.nowData.data.filter(item => item.name === nval)[0];
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
          this.nowData = null;
        }
      },
      childrenMenuId(nval) {
        this.getChildrenMenuData();
      },
    },
    methods: {
      // 主菜单数据获取
      getMenuData() {
        try {
          const tplData = window.tplDB.getAll.map((item) => {
            return item.structureId;
          });
          console.log(tplData);
          const menuData = [];
          window.girderDB.getAll.map((item) => {
            console.log(tplData.indexOf(item.id), item.id);
            if (tplData.indexOf(item.id) > -1) {
              menuData.push({
                name: item.name,
                id: item.id,
              });
            }
            return null;
          });
          // structureId
          if (this.menuId) {
            this.getChildrenMenuData();
          } else {
            this.nowData = null;
          }
          this.menuData = menuData;
          console.log(this.menuData);
        } catch (error) {}
      },
      // 子菜单切换
      getChildrenMenuData() {
        try {
          const datas = window.tplDB.get({ structureId: this.menuId });
          console.log(datas);
          this.childrenMenuData = datas.map((item) => {
            return {
              name: item.name.split('-')[0],
              id: item.id,
            };
          });
          const id = this.childrenMenuId;
          if (this.menuId && id === null) {
            this.childrenMenuId = this.childrenMenuData[0].id;
          }
          console.log('子菜单', this.menuId, id);
          if (id) {
            const nowData = this.$unity.copyObj(datas.filter(item => item.id === id)[0]);
            this.updata = nowData;
            this.tplName = nowData.name.split('-')[0];
            this.nowData = nowData.data;
          }
        } catch (error) {}
      },
      // 保存取消切换菜单
      showMenu(menuId, childrenMenuId) {
        this.menuId = menuId;
        this.childrenMenuId = childrenMenuId;
      },
      add() {
        this.$message('添加');
        this.menuId = null;
        this.childrenMenuId = null;
        this.nowGroupName = null;
        this.tplName = '';
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
            window.tplDB.del({ id: this.childrenMenuId.id });
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
        let msg = '添加成功！';
        let errorMsg = '数据插入出错！';
        try {
          // 添加
          if (this.addState) {
            if (this.tplName) {
              const cname = this.structureId;
              const name = `${this.tplName}-${cname}`;
              const id = this.$unity.timeId();
              const tplData = {
                name: name,
                id: id,
                structureId: cname,
                data: this.$unity.copyObj(this.nowData),
              };
              if (window.tplDB.insert(tplData, { name: name })) {
                this.$message.error('模板已经存在！请重新输入！');
              } else {
                this.$message.success('模板保存成功！');
                this.showMenu(cname, id);
              }
            } else {
              this.$message.error('必须输入模板名称！');
            }
          } else { // 修改
            msg = '修改成功！';
            errorMsg = '数据更新出错！';
            // const updta = this.update;
            this.updata.name = `${this.tplName}-${this.menuId}`;
            this.updata.data = this.$unity.copyObj(this.nowData);
            window.tplDB.uptate(this.updata);
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
        const msg = this.addState ? '您确定要放弃添加模板吗？' : '您确定要放弃修改模板吗？';
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
