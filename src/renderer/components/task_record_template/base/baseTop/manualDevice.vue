<template>
  <div>
    <el-dialog title="设备选择"
      :visible="show"
      width="80%"
      :show-close="false"
      >
      <div>
        <h3 v-if="selectKhs.length !== 0">未分组孔号</h3>
        <h3 v-else style="color: #67C23A">所有分组完成! 点击确定保存。</h3>
        <el-radio-group>
          <el-radio-button v-for="(item, index) in selectKhs" :key="index" :label="item"></el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <h3>使用设备:
          <span style="color: #409EFF">{{deviceName}}</span>
        </h3>
        <h3>选择张拉模式</h3>
        <el-radio-group v-model="msName" @change="msSelectFunc()">
          <el-radio-button v-for="(item, index) in msData" :key="index" :label="zlms[item]"></el-radio-button>
        </el-radio-group>
      </div>

      <div>
        <h3>张拉组孔号</h3>
        <el-form :inline="true" :model="zuhao" :rules="zuhaoRules" ref="zuhao" size="small">
          <el-form-item prop="A" label="A组孔号" v-if="['A1单顶', 'A两顶', '四顶'].indexOf(msName) > -1">
            <el-input v-model="zuhao.A" @click.native="khSelectFunc('A')" suffix-icon="el-icon-news" readonly></el-input>
          </el-form-item>
          <el-form-item prop="B" label="B组孔号" v-if="['B1单顶', 'B两顶', '四顶'].indexOf(msName) > -1">
            <el-input v-model="zuhao.B" @click.native="khSelectFunc('B')" suffix-icon="el-icon-news" readonly></el-input>
          </el-form-item>
          <el-button-group>
            <el-button type="primary" @click="saveFunc()" :disabled="saveBtn" v-if="selectKhs.length !== 0">完 成</el-button>
            <el-button type="success" @click="saveFunc(), okFunc()" :disabled="saveBtn" v-if="selectKhs.length === 0">确 定</el-button>
            <el-button type="warning" @click="msSelectFunc()">重 置</el-button>
          </el-button-group>
        </el-form>
      </div>
      <br>
      <div>
        <h3 style="color: #409EFF">完成的分组</h3>
        <el-radio-group v-if="zuhaos.length > 0">
          <el-radio-button v-for="(item, index) in zuhaos" :key="index" :label="item.name"></el-radio-button>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择孔号" :visible.sync="khSelect" width="70%">
      <el-radio-group size="small" v-model="zuhao[ab]" @change="khSelectOkFunc($event)">
        <el-radio-button v-for="(item, index) in selectKhs" :key="index" :label="item"></el-radio-button>
      </el-radio-group>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'shebeiSelect',
    props: ['show', 'deviceName', 'khs'],
    computed: {
      msData() {
        try {
          return window.deviceDB.getOne({ name: this.deviceName }).tensioningPattern;
          // return this.$store.state.shebei.datas.filter(item => item.name === this.deviceName)[0].ms;
        } catch (error) {
          return error;
        }
      },
      selectKhs() {
        const arr = this.khOk.slice(0);
        arr.push(...[this.zuhao.A, this.zuhao.B]);
        const newArr = [];
        for (const item of this.khs) {
          if (arr.indexOf(item) === -1) {
            newArr.push(item);
          }
        }
        console.log(newArr);
        return newArr;
      },
    },
    data() {
      return {
        // 张拉模式选择
        msName: null,
        // 孔号选择状态
        khSelect: false,
        // 分好组的数据
        zuhaos: [],
        // 当前分组数据
        zuhao: {
          zlms: null,
          A: '',
          B: '',
        },
        // 当前孔号选择A||B
        ab: null,
        // 保存组完成按钮状态
        saveBtn: true,
        // 以选择的孔号
        khOk: [],
        zlms: ['A1单顶', 'A两顶', 'B1单顶', 'B两顶', '四顶'],
        zuhaoRules: {
          A: [{
            required: true,
            message: '请选择A组孔号',
            trigger: 'blur',
          }],
          B: [{
            required: true,
            message: '请选择B组孔号',
            trigger: 'blur',
          }],
        },
        groupOK:[],
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('取消选择？', { type: 'warning' }).then(
          _ => { this.close();
          }).catch( _ => { return null });
      },
      close() {
        this.$emit('update:show', false);
      },
      okFunc() {
        this.$emit('groupData', this.groupOK);
        this.close();
      },
      // 张拉模式切换
      msSelectFunc() {
        this.zuhao = {
          zlms: null,
          A: '',
          B: '',
        };
        this.zuhaoRulesFunc();
      },
      // 张拉组选孔号 A||B
      khSelectFunc(ab) {
        this.zuhao.zlms = this.zlms.indexOf(this.msName);
        this.ab = ab;
        this.khSelect = true;
      },
      // 孔号选择完成
      khSelectOkFunc(event) {
        this.zuhao[this.ab] = event;
        this.zuhaoRulesFunc();
        this.khSelect = false;
      },
      // 保存当前组数据
      saveFunc() {
        const zuhao = this.zuhao;
        let name = `${zuhao.A}${zuhao.B}`;
        const hole = [`${zuhao.A}${zuhao.B}`];
        if (zuhao.zlms === 4) {
          name = `${zuhao.A}/${zuhao.B}`;
          hole[0] = zuhao.A;
          hole[1] = zuhao.B;
        }
        this.zuhaos.push({
          name: name,
          zlms: zuhao.zlms,
        });
        this.groupOK.push({
          hole: hole,
          tensioningPattern: zuhao.zlms,
        });
        this.khOk.push(...[zuhao.A, zuhao.B]);
        console.log(this.khOk);
        // 重置状态
        this.msSelectFunc();
        console.log(this.zuhaos);
      },
      // 验证选择孔号
      zuhaoRulesFunc() {
        this.$refs.zuhao.validate((valid) => {
          if (valid) {
            this.saveBtn = false;
          } else {
            this.saveBtn = true;
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  div {
    text-align: left;
  }

</style>

