<template>
  <div class="wh100" ref="device">
    <el-container class="wh100">
      <el-aside style="border-right:1px solid #EDF2FC;" width="224px">
        <menu-two :menuData="menuData" :nowName.sync="nowName" @add="add" @edit="edit" @down="down" @del="del" @save="save" @cancel="cancel"></menu-two>
      </el-aside>
      <el-main class="task-main">
        <h1 v-show="!nowData">没有数据</h1>
        <div v-if="nowData" class="wh100 device-info">
          <el-form :model="nowData" :rules="nowDataRules" ref="nowData" label-width="90px">
            <div class="row-flex">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="nowData.name" @focus="$unity.focusAllVal($event)"></el-input>
              </el-form-item>

              <el-form-item label="千斤顶型号">
                <el-input @focus="$unity.focusAllVal($event)" v-model="nowData.liftingJackModel"></el-input>
              </el-form-item>
              <el-form-item label="油泵型号">
                <el-input @focus="$unity.focusAllVal($event)" v-model="nowData.oilPumpModel"></el-input>
              </el-form-item>
            </div>
            <el-form-item label="张拉模式" style="flex:2;">
              <el-checkbox-group @focus="$unity.focusAllVal($event)" v-model="nowData.tensioningPattern">
                <el-checkbox :label="index" border v-for="(item, index) in ['A1单顶', 'A两顶', 'B1单顶', 'B两顶', '四顶']" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-tabs @focus="$unity.focusAllVal($event)" v-model="tabsActive" type="card">
              <el-tab-pane label="顶参数" name="a">
                <div :class="{item, 'correction-active': correction.state && correction.ab === item}" v-for="(item, index) in ['A1', 'A2', 'B1', 'B2']" :key="index">
                  <div class="title">
                    <h3 :class="item">{{item}}顶参数</h3>
                    <el-button :disabled="!editState" plain round style="height:40px;" @click="correctionFunc(item)">{{correction.state ? '完成' : '系数校正'}}</el-button>
                  </div>
                  <!-- 位移校正 displacementCorrection -->
                  <div class="row-flex">
                    <el-form-item :label="i" v-for="(i, index) in ['20mm', '60mm', '100mm', '140mm', '180mm', '210m']" :key="index">
                      <el-input readonly="readonly" @click.native="setFunc(item, 'displacementCorrection', index)" :value="nowData[item].displacementCorrection[index]"></el-input>
                    </el-form-item>
                  </div>
                  <!-- 压力校正 pressureCorrection -->
                  <div class="row-flex mpa">
                    <el-form-item :label="i" v-for="(i, index) in ['2.5Mpa', '7.5Mpa', '12.5Mpa', '17.5Mpa', '22.5Mpa', '27.5Mpa']" :key="index">
                      <el-input readonly="readonly" @click.native="setFunc(item, 'pressureCorrection', index)" v-model="nowData[item].pressureCorrection[index]"></el-input>
                    </el-form-item>
                  </div>
                  <div class="row-flex map">
                    <el-form-item :label="i" v-for="(i, index) in ['32.5Mpa', '37.5Mpa', '42.5Mpa', '47.5Mpa', '52.5Mpa', '57.5Mpa']" :key="index">
                      <el-input readonly="readonly" @click.native="setFunc(item, 'pressureCorrection', index + 6)" v-model="nowData[item].pressureCorrection[index + 6]"></el-input>
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
                      <el-input @focus="$unity.focusAllVal($event)" v-model="nowData[item].liftingJackNumber"></el-input>
                    </el-form-item>
                    <el-form-item label="油泵编号">
                      <el-input @focus="$unity.focusAllVal($event)" v-model="nowData[item].oilPumpNumber"></el-input>
                    </el-form-item>
                    <el-form-item >
                    </el-form-item>
                  </div>
                  <div class="row-flex">
                    <el-form-item label="回归方程">
                      <el-input type="number" @focus="$unity.focusAllVal($event)" v-model="nowData[item].a">
                        <template slot="prepend">{{nowData.equation ? 'F=': 'P='}}</template>
                      </el-input>
                    </el-form-item>
                    <div>
                      <el-input type="number" @focus="$unity.focusAllVal($event)" v-model="nowData[item].b">
                        <template slot="prepend">{{nowData.equation ? 'P+': 'F+'}}</template>
                      </el-input>
                    </div>
                    <!-- <el-form-item :label="nowData.equation ? 'P+': 'F+'" class="fc">
                      <el-input type="number" v-model="nowData[item].b"></el-input>
                    </el-form-item> -->
                    <el-form-item label="标定日期">
                      <el-date-picker
                      v-model="nowData[item].demarcationDate"
                      value-format="yyyy-MM-dd"
                      align="center"
                      style="width: auto;" type="date"
                      placeholder="选择日期"
                      :editable="false"
                      :clearable="false"></el-date-picker>
                    </el-form-item>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </div>
      </el-main>
    </el-container>
    <el-dialog
      :title="`校正值计算 · ${correction.ab} · ${correction.str}`"
      :visible="setState"
      :show-close="false"
      width="35%"
      top="40"
      :modal="true"
      >
      <el-form label-width="100px">
        <!-- <el-tag size="medium" type="success">{{correction.ab}}--{{correction.str}}</el-tag> -->
        <el-form-item label="实际测量值" >
          <el-input autofocus type="number" @focus="$unity.focusAllVal($event)" v-model.number="correction.a"></el-input>
        </el-form-item>
        <el-form-item label="设备显示值">
          <el-input type="number" @focus="$unity.focusAllVal($event)" v-model.number="correction.b"></el-input>
        </el-form-item>
        <el-form-item label="系数">
          <p hidden="hidden">{{correctionC}}</p>
          <el-input type="number" @focus="$unity.focusAllVal($event)" v-model.number="correction.c"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setState = false">取 消</el-button>
        <el-button type="primary" @click="saveCorrection()">确 定</el-button>
      </span>
    </el-dialog>
    <div class="device-manual" v-if="correction.state">
      <manual class="main" :did="nowData.id" :dab="correction.ab" @setFunc="setFunc"/>
    </div>
  </div>
</template>

<script>
  import MenuTwo from '../menus/menuTow';
  import Manual from '../manual/manual.vue';

  const baseData = {
    name: '',
    liftingJackModel: '',
    oilPumpModel: '',
    tensioningPattern: [], // 张拉模式
    equation: true, // 方程选择true F=aP+b， false P=aF+b
    ceiling: 0, // 位移上限
    lower: 0, // 位移下限
    WorkCeiling: 0, // 工作位移上限
    WorkLower: 0, // 工作位移下限
    // sensor: 0, // 传感器参数
    A1: {
      liftingJackNumber: '', // 千斤顶编号
      oilPumpNumber: '', // 油泵编号
      demarcationDate: '', // 标定日期
      a: 0, // 方程常数a
      b: 0, // 方程常数b
      displacementCorrection: [1, 1, 1, 1, 1, 1], // 位移校正
      pressureCorrection: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 压力校正
    },
    A2: {
      liftingJackNumber: '',
      oilPumpNumber: '',
      demarcationDate: '',
      a: 0,
      b: 0,
      displacementCorrection: [1, 1, 1, 1, 1, 1],
      pressureCorrection: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
    B1: {
      liftingJackNumber: '',
      oilPumpNumber: '',
      demarcationDate: '',
      a: 0,
      b: 0,
      displacementCorrection: [1, 1, 1, 1, 1, 1],
      pressureCorrection: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
    B2: {
      liftingJackNumber: '',
      oilPumpNumber: '',
      demarcationDate: '',
      a: 0,
      b: 0,
      displacementCorrection: [1, 1, 1, 1, 1, 1],
      pressureCorrection: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
  };
  export default {
    name: 'device',
    components: {
      MenuTwo,
      Manual,
    },
    computed: {
      // 编辑状态
      editState() {
        return this.$store.state.global.editState;
      },
      addState() {
        return this.$store.state.global.addState;
      },
      // 实时计算校正数据
      correctionC() {
        this.correction.c = Number((this.correction.a / this.correction.b).toFixed(6));
      },
      currentlyData() {
        const id = this.nowData.id;
        const p1 = this.$store.state.global.PLC1Data;
        const p2 = this.$store.state.global.PLC2Data;
        return {
          A1mpa: this.$UC.plc2mpa(p1.A1mpa, 'A1', id),
          A1mm: this.$UC.plc2mm(p1.A1mm, 'A1', id),
          B1mpa: this.$UC.plc2mpa(p1.B1mpa, 'B1', id),
          B1mm: this.$UC.plc2mm(p1.B1mm, 'B1', id),
          A2mpa: this.$UC.plc2mpa(p2.A2mpa, 'A2', id),
          A2mm: this.$UC.plc2mm(p2.A2mm, 'A2', id),
          B2mpa: this.$UC.plc2mpa(p2.B2mpa, 'B2', id),
          B2mm: this.$UC.plc2mm(p2.B2mm, 'B2', id),
        };
      },
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
      console.timeEnd('c');
    },
    beforeMount() {
      this.nowData = this.$unity.copyObj(baseData);
      this.getMenuData();
      console.log(this.menuData);
      if (this.menuData.length > 0) {
        this.nowName = this.menuData[0].name;
      }
    },
    data: () => ({
      mmStr: ['20mm', '60mm', '100mm', '140mm', '180mm', '210m'],
      mpaStr: ['2.5Mpa', '7.5Mpa', '12.5Mpa', '17.5Mpa', '22.5Mpa', '27.5Mpa',
        '32.5Mpa', '37.5Mpa', '42.5Mpa', '47.5Mpa', '52.5Mpa', '57.5Mpa'],
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
      setState: false, //计算参数
      correction: {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        state: false,
        ab: null,
        str: null,
      },
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
          const menus = window.deviceDB.reverseGetAll().map((item) => {
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
              nowData.tensioningPattern = Array.from(nowData.tensioningPattern).sort();
              console.log(nowData.tensioningPattern);
              if (this.addState) {
                nowData.id = this.$unity.timeId();
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
      // 编辑禁用
      disabled(state = true) {
        const input = this.$refs.device;
        this.$d3.select(input).selectAll('input').attr('disabled', state);
      },
      // 校正计算
      setFunc(ab, item2, index) {
        if (!this.editState) {
          return null;
        }
        this.setState = true;
        this.correction.ab = ab;
        this.correction.item2 = item2;
        this.correction.index = index;
        if (item2 === 'displacementCorrection') {
          this.correction.b = this.currentlyData[`${ab}mm`];
          this.correction.str = this.mmStr[index];
        } else {
          this.correction.b = this.currentlyData[`${ab}mpa`];
          this.correction.str = this.mpaStr[index];
        }
      },
      // 确认校正
      saveCorrection() {
        if (this.correction.c && this.correction.c < 1.2 && this.correction.c > 0.8) {
          this.nowData[this.correction.ab][this.correction.item2][this.correction.index] = this.correction.c;
          this.setState = false;
        } else {
          this.errorShow('校正值有误！校正值必须在 0.8 ~ 1.2 之间');
        }
      },
      correctionFunc(ab) {
        this.correction.ab = ab;
        this.correction.state = !this.correction.state;
      }
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
.title{
  height: 40px;
  background-color: #dfe4ed;
  margin-bottom: 5px;
  box-shadow: 3px 2px 5px;
  padding: 0 5px;
  h3{
    display: inline;
    font-size: 24px;
    line-height: 40px;
  }
  button{
    float: right;
  }
}
.device-manual{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 2;
  display: flex;
  flex-direction: column;
  .operation{
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
  }
  .main{
    height: 50%;
  }
}
.correction-active{
  position: fixed;
  top: 52%;
  left: 0;
  z-index: 3;
  width: 100%;
}
</style>

<style lang="scss">
.mpa {
  .el-form-item--small.el-form-item{
    margin-bottom: 0;
  }
}
.el-input--small .el-input__inner{
  padding-left: 1px;
  padding-right: 1px;
}
</style>
