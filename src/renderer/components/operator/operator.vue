<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-aside style="border-right:1px solid #EDF2FC;" width="224px">
        <menu-two :menuData="menuData" :nowName.sync="nowName" @add="add" @edit="edit" @down="down" @del="del" @save="save" @cancel="cancel"></menu-two>
      </el-aside>
      <el-main class="task-main">
        <h1 v-if="!nowData">没有数据</h1>
        <div class="wh100 operator" v-if="nowData">
          <div class="img">
            <img src="" alt="没有图片">
          </div>
          <div>
            <el-form :model="nowData" :rules="nowDataRules" ref="nowData" label-width="120px">
              <el-form-item label="角色选择" v-if="editState">
                <el-radio-group v-model="role">
                  <el-radio :label="true">管理员</el-radio>
                  <el-radio :label="false">操作员</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="操作员姓名" prop="name">
                <el-input v-model="nowData.name"></el-input>
              </el-form-item>
              <el-form-item label="登陆密码" prop="pwd">
                <el-input v-model="nowData.pwd"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import MenuTwo from '../menus/menuTow';

  const baseData = {
    name: '',
    pwd: '',
    img: '',
  };
  export default {
    name: 'devide',
    components: {
      MenuTwo,
    },
    computed: {
      // 数据库
      DBmain() {
        return this.$db.db('main');
      },
      // 数据库
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
      this.getMenuData();
      if (!(this.menuData.length === 0)) {
        this.nowName = this.menuData[0].name;
      }
    },
    data: () => ({
      role: false,
      nowData: null,
      nowDataRules: {
        name: [
          { required: true, message: '请输入成员姓名', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' },
        ],
        pwd: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
        ],
      },
      menuData: null,
      nowName: null,
    }),
    watch: {
      // 切换输入框状态
      editState(nval) {
        this.disabled(nval ? null : true);
      },
      // 切换菜单选项
      nowName(nval, oval) {
        if (nval !== null) {
          this.switchMenu();
        }
      },
    },
    methods: {
      // 菜单数据
      getMenuData() {
        // const operator = this.DBmain.getCollection('admin').addDynamicView('operator');
        // operator.applyFind({ permissions: { $lt: 9 } });
        // operator.applySimpleSort('permissions', true);
        // this.DBmain.save();
        const menus = this.DBmain.getCollection('admin').getDynamicView('operator').data().map((item) => {
          return {
            name: item.name,
            permissions: item.permissions,
          };
        });
        console.log('数据', menus);
        if (menus.length > 0) {
          if (this.nowName === null) {
            this.nowName = menus[0].name;
          }
        } else {
          this.nowData = null;
        }
        this.menuData = menus;
      },
      // 切换菜单
      switchMenu() {
        console.log('切换菜单');
        try {
          this.nowData = this.$unity.copyObj(this.DBmain.getCollection('admin').findOne({ name: this.nowName }));
        } catch (error) {
          this.errorShow(`${error}`);
        }
      },
      add() {
        this.$message('添加');
        this.nowName = null;
        this.nowData = this.$unity.copyObj(baseData);
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
            const db = this.DBmain.getCollection('admin');
            const delData = db.findOne({ name: this.nowName });
            db.remove(delData);
            this.DBmain.save();
            this.nowName = null;
            this.getMenuData();
            this.$message('删除成功！');
          } catch (error) {
            this.errorShow(`删除出错！${error}`);
          }
        });
      },
      save() {
        this.$message('保存');
        this.$refs.nowData.validate((valid) => {
          if (valid && !this.supervisorsEdit) {
            const nowData = this.nowData;
            let msg = '添加成功！';
            let errorMsg = '数据插入出错！';
            try {
              // 添加
              if (this.addState) {
                // 判断用户名是否存在
                if (this.DBmain.getCollection('admin').findOne({ name: nowData.name })) {
                  this.$message.error('名字重复！请重新输入！');
                  return;
                }
                nowData.permissions = this.role ? 1 : 0;
                console.log(this.nowData);
                this.DBmain.getCollection('admin').insert(nowData);
                this.DBmain.save();
                this.nowName = nowData.name;
                // 修改
              } else {
                msg = '修改成功！';
                errorMsg = '数据更新出错！';
                this.DBmain.getCollection('admin').update(nowData);
                this.DBmain.save();
              }
              this.$message.success(msg);
              this.getMenuData();
              this.$store.commit('editState', false);
              this.$store.commit('addState', false);
            } catch (error) {
              // this.$notify.error({
              //   showClose: true,
              //   duration: 0,
              //   title: '错误',
              //   message: `${errorMsg}--${error}`,
              // });
              this.errorShow(`${errorMsg}--${error}`);
            }
          } else {
            const msg = '输入有误！请安规输入！';
            this.$message.error(msg);
          }
        });
      },
      cancel() {
        const msg = this.addState ? '您确定要放弃添加成员吗？' : '您确定要放弃修改成员吗？';
        this.$confirm(msg, '提示', {
          confirmButtonText: '取消编辑',
          cancelButtonText: '继续编辑',
          type: 'warning',
        }).then(() => {
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
        this.$store.commit('editState', false);
        this.$store.commit('addState', false);
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

<style lang="scss" scoped>
  .operator {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 200px;
      width: 200px;
      border: 1px dashed #D8DCE5;
    }
  }

</style>

