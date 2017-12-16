<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-aside style="border-right:1px solid #EDF2FC;" width="224px">
        <menu-two :menuData="menuData" :nowName.sync="nowName" @add="add" @edit="edit" @down="down" @del="del" @save="save" @cancel="cancel"></menu-two>
      </el-aside>
      <el-main class="task-main">
        <!-- <user-info :userInfo.sync='userInfoData' :supervisors.sync='supervisors'></user-info> -->
        <h1 v-if="!userInfo">没有数据</h1>
        <el-container class="wh100" v-if="userInfo">
          <el-aside width="50%">
            <el-form :model="userInfo" :rules="userInfoRules" ref="userInfo" label-width="90px">
              <el-form-item :label="item[1]" v-for="(item, index) in templateName" :key="index" :prop="item[0]">
                <el-input v-model="userInfo[item[0]]"></el-input>
              </el-form-item>
            </el-form>
          </el-aside>
          <el-main class="flex-column">
            <div class="user-item">
              <h3>监理信息</h3>
              <el-tabs type="card" @tab-click="supervisorsTab" >
                <el-tab-pane :disabled="supervisorsEdit" :label="item.name" v-for="(item, index) in userInfo.supervisors" :key="index"></el-tab-pane>
              </el-tabs>
              <div class="img-text" v-if="supervisors">
                <div style="width:300px;">
                  <img src="" alt="没有图片">
                </div>
                <div>
                  <el-form :model="supervisors" :rules="supervisorsRules" ref="supervisors" label-width="90px">
                    <input type="text" v-model="supervisors.img" hidden="hidden">
                    <el-form-item label="监理姓名" prop="name">
                      <el-input v-model="supervisors.name" :disabled="!supervisorsEdit"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div style="display:flex;justify-content: center;">
                <el-button-group>
                  <el-button type="primary" v-show="!supervisorsEdit" :disabled="!editState" @click="addSupervisors()">添加</el-button>
                  <el-button type="primary" v-show="!supervisorsEdit" :disabled="!editState" @click="editSupervisors()">编辑</el-button>
                  <el-button type="warning" v-show="supervisorsEdit" @click="cancelSupervisors()">取消</el-button>
                  <el-button type="success" v-show="supervisorsEdit" @click="saveSupervisors()">保存</el-button>
                </el-button-group>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  // import UserInfo from './template/userInfo';
  import MenuTwo from '../menus/menuTow';
  const userInfo = {
    projectName: '', // '项目名称',
    engineeringName: '', // '工程名称',
    constructionUnit: '', // '施工单位',
    girderFactory: '', // '预制梁厂',
    supervisorUnit: '', // '监理单位',
    unitEngineering: '', // '单位工程',
    subdivision: '', // '分部工程',
    subPoject: '', // '分项工程',
    contractNumber: '', // '土建合同号',
    pileNumber: '', // '压桩号',
    engineeringPart: '', // '工程部位',
    logo: '', // '',
    supervisors: [],
  };
    // 监理资料
  const supervisors = {
    name: '', // '监理名称',
    img: '',
  };
  export default {
    name: 'devide',
    components: {
      MenuTwo,
      // UserInfo,
    },
    computed: {
      // 编辑状态
      editState() {
        return this.$store.state.global.editState;
      },
      addState() {
        return this.$store.state.global.addState;
      },
    },
    updated() {
      if (this.editState) {
        this.disabled(null);
      } else {
        this.disabled();
      }
    },
    beforeMount() {
      this.DB = window.usersDB;
      this.getMenuData();
    },
    data: () => ({
      DB: null,
      userInfo: false,
      templateName: [
        ['projectName', '项目名称'],
        ['engineeringName', '工程名称'],
        ['constructionUnit', '施工单位'],
        ['girderFactory', '预制梁厂'],
        ['supervisorUnit', '监理单位'],
        ['unitEngineering', '单位工程'],
        ['subdivision', '分部工程'],
        ['subPoject', '分项工程'],
        ['contractNumber', '土建合同号'],
        ['pileNumber', '压桩号范围'],
        ['engineeringPart', '工程部位'],
      ],
      userInfoRules: {
        projectName: [{
          required: true,
          message: '请输入项目名称',
          trigger: 'blur',
        }],
        engineeringName: [{
          required: true,
          message: '请输入工程名称',
          trigger: 'blur',
        }],
        constructionUnit: [{
          required: true,
          message: '请输入施工单位名称',
          trigger: 'blur',
        }],
        girderFactory: [{
          required: true,
          message: '请输入预制梁厂名称',
          trigger: 'blur',
        }],
        supervisorUnit: [{
          required: true,
          message: '请输入监理单位名称',
          trigger: 'blur',
        }],
      },
      supervisors: null,
      supervisorsRules: {
        name: [
          { required: true, message: '请输入监理姓名', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
      },
      supervisorsEdit: false,
      supervisorsAdd: false,
      supervisorsIndex: null,
      menuData: null,
      nowName: null,
    }),
    watch: {
      // 切换菜单选项
      nowName(nval, oval) {
        if (nval !== null) {
          this.switchUser();
        }
      },
      // 切换监理数据
      supervisorsIndex(nval) {
        if (nval !== null) {
          this.supervisors = this.userInfo.supervisors[nval];
        } else {
          this.supervisors = null;
        }
      },
    },
    methods: {
      // 菜单数据
      getMenuData() {
        const users = this.DB.getAll.map((item) => {
          return { name: item.projectName };
        });
        if (users.length > 0 && this.nowName === null) {
          this.nowName = users[0].name;
        }
        if (this.nowName !== null) {
          this.switchUser();
        }
        this.menuData = users;
      },
      // 切换用户
      switchUser() {
        try {
          this.userInfo = this.$unity.copyObj(this.DB.getOne({ projectName: this.nowName }));
          if (this.userInfo.supervisors.length > 0) {
            this.supervisors = this.$unity.copyObj(this.userInfo.supervisors[0]);
            this.supervisorsIndex = 0;
          } else {
            this.supervisors = null;
          }
        } catch (error) {
          this.errorShow(`切换用户--${error}`);
        }
      },
      add() {
        this.$message('添加');
        this.nowName = null;
        this.userInfo = this.$unity.copyObj(userInfo);
        this.supervisors = null;
      },
      edit() {
        this.$message('编辑');
      },
      down() {
        this.$message('下载');
      },
      del() {
        this.$confirm('您确定删除该项目吗？ 将删除项目中的所有张拉数据！', '危险警告！', {
          confirmButtonText: '取消',
          cancelButtonText: '继续删除',
          type: 'warning',
        }).then(() => {
          this.$message({
            type: 'info',
            message: '取消删除！',
          });
        }).catch(() => {
          this.DB.del({ projectName: this.nowName });
          this.nowName = null;
          this.getMenuData();
          this.$message('删除成功！');
        });
      },
      save() {
        this.$message('保存');
        this.$refs.userInfo.validate((valid) => {
          if (valid && !this.supervisorsEdit) {
            const userInfo = this.userInfo;
            let msg = '添加成功！';
            let errorMsg = '数据插入出错！';
            try {
              // 添加
              if (this.addState) {
                // 判断用户名是否存在
                const userId = `${new Date().getTime()}`;
                userInfo.id = userId;

                if (this.DB.insert(userInfo, { projectName: userInfo.projectName })) {
                  this.$message.error('项目已经存在！请重新输入！');
                  return;
                }
                const db = this.$db.db(`${userId}.tensioning`);
                db.addCollection('device');
                db.addCollection('tpl', { indices: ['structureId', 'tplName'] });
                db.save();
              // 修改
              } else {
                msg = '修改成功！';
                errorMsg = '数据更新出错！';
                this.DB.update(userInfo);
              }
              this.nowName = userInfo.projectName;
              this.$message.success(msg);
              this.getMenuData();
              this.$store.commit('editState', false);
              this.$store.commit('addState', false);
            } catch (error) {
              this.errorShow(`${errorMsg}--${error}`);
            }
          } else {
            const msg = this.supervisorsEdit ? '请先完成监理编辑！' : '输入有误！请安规输入！';
            this.$message.error(msg);
          }
        });
      },
      cancel() {
        const msg = this.addState ? '您确定要取消添加用户吗？' : '您确定要取消修改用户吗？';
        this.$confirm(msg, '提示', {
          confirmButtonText: '取消编辑',
          cancelButtonText: '继续编辑',
          type: 'warning',
        }).then(() => {
          if (this.nowName === null) {
            this.getMenuData();
          }
          this.switchUser();
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
        this.$store.commit('editState', false);
        this.$store.commit('addState', false);
      },
      // 监理切换
      supervisorsTab(e) {
        this.supervisorsIndex = e.paneName;
      },
      // 监理添加
      addSupervisors() {
        this.userInfo.supervisors.push(this.$unity.copyObj(supervisors));
        this.supervisors = this.userInfo.supervisors[this.userInfo.supervisors.length - 1];
        // this.supervisorsIndex = this.userInfo.supervisors.length - 1;
        this.supervisorsEdit = true;
        this.supervisorsAdd = true;
      },
      // 监理编辑
      editSupervisors() {
        this.supervisors = this.$unity.copyObj(this.userInfo.supervisors[this.supervisorsIndex]);
        this.supervisorsEdit = true;
      },
      // 取消监理编辑
      cancelSupervisors() {
        if (this.supervisorsAdd) {
          this.userInfo.supervisors.pop();
        }
        this.supervisors = this.userInfo.supervisors[this.supervisorsIndex];
        this.supervisorsEdit = false;
        this.supervisorsAdd = false;
      },
      // 保存监理编辑
      saveSupervisors() {
        this.$refs.supervisors.validate((valid) => {
          if (valid) {
            this.$message.success('监理添加成功！');
            this.userInfo.supervisors[this.supervisorsIndex] = this.$unity.copyObj(this.supervisors);
            this.supervisorsEdit = false;
            this.supervisorsAdd = false;
          } else {
            this.$message.error('输入有误！请安规输入！');
          }
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
        this.$d3.selectAll('input').attr('disabled', state);
      },
    },
  };

</script>

<style lang="scss">
  .user-item {

    display: flex;
    flex-direction: column;
    h3 {
      background-color: #EDF2FC;
      padding: 10px 5px;
    }
    .img-text {
      display: flex;
      height: 220px;
      align-items: center;
      &>div {
        display: flex;
        justify-content: center;
        img {
          height: 200px;
          width: 200px;
          border: 1px dashed #D8DCE5;
        }
      }
    }
  }

</style>
