<template>
  <div class="wh100">
    <h1 v-if="!userInfo">没有数据</h1>
    <el-container class="wh100" v-if="userInfo">
      <el-aside width="50%">
        <el-form :model="userInfo" :rules="userInfoRules" ref="userInfo" label-width="90px">
          <el-form-item :label="item[1]"
            v-for="(item, index) in templateName"
            :key="index"
            :prop="item[0]">
            <el-input v-model="userInfo[item[0]]"></el-input>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main class="flex-column">
        <div class="user-item">
          <h3>监理信息</h3>
          <el-tabs type="card">
            <el-tab-pane label="用户管理" v-for="(item, index) in supervisors" :key="index"></el-tab-pane>
          </el-tabs>
          <div class="img-text">
            <div style="width:300px;">
              <img src="" alt="没有图片">
            </div>
            <div>
              <el-form :model="supervisors" label-width="90px">
                <input type="text" v-model="supervisors.img" hidden="hidden">
                <el-form-item label="监理姓名">
                  <el-input v-model="supervisors.name"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div style="display:flex;justify-content: center;">
            <el-button-group>
              <el-button type="primary" v-show="!supervisorsEdit" :disabled="!edit">添加</el-button>
              <el-button type="warning" v-show="supervisorsEdit">取消</el-button>
              <el-button type="success" v-show="supervisorsEdit">保存</el-button>
            </el-button-group>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
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
};
  // 监理资料
const supervisors = {
  name: '', // '监理名称',
  img: '',
};
export default {
  name: 'userInfo',
  props: ['userInfo', 'supervisors'],
  computed: {
    edit() {
      return this.$store.state.global.editState;
    },
  },
  data: () => ({
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
      projectName: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
      ],
      engineeringName: [
        { required: true, message: '请输入工程名称', trigger: 'blur' },
      ],
      constructionUnit: [
        { required: true, message: '请输入施工单位名称', trigger: 'blur' },
      ],
      girderFactory: [
        { required: true, message: '请输入预制梁厂名称', trigger: 'blur' },
      ],
      supervisorUnit: [
        { required: true, message: '请输入监理单位名称', trigger: 'blur' },
      ],
    },
    supervisorsEdit: false,
  }),
  watch: {
    edit(nval) {
      console.log(nval);
      this.disabled(nval ? null : true);
    },
  },
  mounted() {
    this.disabled();
  },
  methods: {
    disabled(state = true) {
      console.log(state);

      this.$d3.selectAll('input').attr('disabled', state);
    },
  },
};
</script>

<style lang="scss">
.user-item{

  display: flex;
  flex-direction: column;
  h3{
    background-color: #EDF2FC;
    padding: 10px 5px;
  }
  .img-text{
    display: flex;
    height: 220px;
    align-items: center;
    &>div{
      display: flex;
      justify-content: center;
      img{
        height: 200px;
        width: 200px;
        border: 1px dashed #D8DCE5;
      }
    }
  }
}
</style>
