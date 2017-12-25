<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-aside style="border-right:1px solid #EDF2FC;" width="224px">
        <menu-two :menuData="menuData" :nowName.sync="nowName" @add="add" @edit="edit" @down="down" @del="del" @save="save" @cancel="cancel"></menu-two>
      </el-aside>
      <el-main class="task-main">
        <h1 v-if="!nowData">没有数据</h1>
        <div v-if="nowData" class="wh100 device-info">
          <el-form :model="nowData" :rules="nowDataRules" ref="nowData" label-width="100px">
            <div class="row-flex">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="nowData.name"></el-input>
              </el-form-item>
              <el-form-item label="千斤顶型号">
                <el-input v-model="nowData.liftingJackModel"></el-input>
              </el-form-item>
              <el-form-item label="油泵型号">
                <el-input v-model="nowData.oilPumpModel"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="张拉模式" style="flex:2;">
              <el-checkbox-group v-model="nowData.tensioningPattern">
                <el-checkbox :label="index" border v-for="(item, index) in ['A1单顶', 'A两顶', 'B1单顶', 'B两顶', '四顶']" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>


            <el-tabs v-model="tabsActive" type="card">
              <el-tab-pane label="顶参数" name="a">
                <!-- 泵顶参数 -->
                <div :class="item" v-for="(item, index) in ['A1', 'A2', 'B1', 'B2']" :key="index">
                  <h3 :class="item" style="background-color: rgb(245, 247, 250);">{{item}}顶参数</h3>
                  <div class="row-flex">
                    <el-form-item label="位移上限">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="位移下限">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="工作位移上限">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="工作位移下限">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="传感器参数">
                      <el-input ></el-input>
                    </el-form-item>
                  </div>
                  <div class="row-flex">
                    <el-form-item label="位移0~20%">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="20~40%">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="40~60%">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="60~80%">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="80~100%">
                      <el-input ></el-input>
                    </el-form-item>
                  </div>
                  <div class="row-flex">
                    <el-form-item label="2.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="7.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="12.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="17.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="22.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                  </div>
                  <div class="row-flex">
                    <el-form-item label="27.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="32.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="37.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="42.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                    <el-form-item label="47.5Mpa">
                      <el-input ></el-input>
                    </el-form-item>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="标定参数" name="b">
                <!-- 标定参数 -->
                <el-form-item label="回归方程">
                  <el-radio-group v-model="nowData.equation">
                    <el-radio :label="true" border>F=aP+b F张拉控制应力KN</el-radio>
                    <el-radio :label="false" border>P=aF+b P张拉控制应力MPa</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div :class="item" v-for="(item, index) in ['A1', 'A2', 'B1', 'B2']" :key="index">
                  <h3 :class="item" style="background-color: rgb(245, 247, 250);">{{item}}标定参数</h3>

                  <div class="row-flex">
                    <el-form-item label="千斤顶编号">
                      <el-input v-model="nowData[item].liftingJackNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="油泵编号">
                      <el-input v-model="nowData[item].oilPumpNumber"></el-input>
                    </el-form-item>
                    <el-form-item >
                    </el-form-item>
                  </div>

                  <div class="row-flex">
                    <el-form-item :label="`回归方程: ${nowData.equation ? 'F=': 'P='}`">
                      <el-input type="number" v-model="nowData[item].a"></el-input>
                    </el-form-item>
                    <el-form-item :label="nowData.equation ? 'P+': 'F+'" class="fc">
                      <el-input type="number" v-model="nowData[item].b"></el-input>
                    </el-form-item>
                    <el-form-item label="标定日期">
                      <el-date-picker v-model="nowData[item].demarcationDate" style="width: auto;" type="date" placeholder="选择日期" :editable="false"></el-date-picker>
                    </el-form-item>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import MenuTwo from '../menus/menuTow';

  const baseData = {
    name: '',
    liftingJackModel: '',
    oilPumpModel: '',
    tensioningPattern: [], // 张拉模式
    equation: true, // 方程选择true F=aP+b， false P=aF+b
    A1: {
      liftingJackNumber: '',
      oilPumpNumber: '',
      demarcationDate: '',
      a: 0, // 方程常数a
      b: 0, // 方程常数b
    },
    A2: {
      liftingJackNumber: '',
      oilPumpNumber: '',
      demarcationDate: '',
      a: 0,
      b: 0,
    },
    B1: {
      liftingJackNumber: '',
      oilPumpNumber: '',
      demarcationDate: '',
      a: 0,
      b: 0,
    },
    B2: {
      liftingJackNumber: '',
      oilPumpNumber: '',
      demarcationDate: '',
      a: 0,
      b: 0,
    },
  };
  export default {
    name: 'device',
    components: {
      MenuTwo,
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
      this.getMenuData();
      console.log(this.menuData);
      if (this.menuData.length > 0) {
        this.nowName = this.menuData[0].name;
      }
    },
    data: () => ({
      tabsActive: 'a',
      role: false,
      nowData: null,
      nowDataRules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' },
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
        try {
          const menus = window.deviceDB.getAll.map((item) => {
            return {
              name: item.name,
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
        } catch (error) {}
      },
      // 切换菜单
      switchMenu() {
        console.log('切换菜单', this.nowName);
        try {
          this.nowData = this.$unity.copyObj(window.deviceDB.getOne({ name: this.nowName }));
        } catch (error) {
          this.errorShow(`切换菜单--${error}`);
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
        this.$confirm('您确定删除该设备吗？', '危险警告！', {
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
            window.deviceDB.del({ name: this.nowName });
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
                nowData.id = this.$unity.timeId();
                nowData.tensioningPattern = nowData.tensioningPattern.sort();
                if (window.deviceDB.insert(nowData, { name: nowData.name })) {
                  this.$message.error('设备已经存在！请重新输入！');
                  return;
                }
                this.nowName = nowData.name;
                // 修改
              } else {
                msg = '修改成功！';
                errorMsg = '数据更新出错！';
                window.deviceDB.update(nowData);
              }
              this.$message.success(msg);
              this.getMenuData();
              this.$store.commit('editState', false);
              this.$store.commit('addState', false);
            } catch (error) {
              this.errorShow(`${errorMsg}--${error}`);
            }
          } else {
            const msg = '输入有误！请安规输入！';
            this.$message.error(msg);
          }
        });
      },
      cancel() {
        const msg = this.addState ? '您确定要放弃添加设备吗？' : '您确定要放弃修改设备吗？';
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
      // operation
      disabled(state = true) {
        this.$d3.selectAll('input').attr('disabled', state);
      },
    },
  };

</script>

<style lang="scss" scoped>
.gloup{
  display: grid;
  grid-template-columns: 50% 50%;
  &>div{
    margin-right: 15px;
  }
}
</style>
