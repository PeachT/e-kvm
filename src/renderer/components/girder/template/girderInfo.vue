<template>
  <div>
    <div class="girder-info title" style="border-top: 1px solid #B4BCCC;">
      <!-- <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="孔名称" width="180">
        </el-table-column>
        <el-table-column label="孔号" >
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in 50" :key="index">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="240">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button type="primary" icon="el-icon-share">添加</el-button>
              <el-button type="warning" icon="el-icon-delete">禁用</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table> -->
      <div class="item1">孔名称</div>
      <div class="item2" style="text-align: center;">孔号</div>
      <div class="item3">操作
         <el-button type="success" icon="el-icon-plus" @click="addFunc" :disabled="GeditState">添加</el-button>
      </div>
    </div>
    <div v-for="(item, index) in holeShow" :key="index" class="girder-info item">
      <div class="item1">{{item.name}}</div>
      <div class="item2">
        <el-tag v-for="(hole, index2) in item.detail" :key="index2">{{hole}}</el-tag>
      </div>
      <div class="item3">
        <el-button-group>
          <el-button type="primary" icon="el-icon-edit" @click="editFunc(index)" :disabled="GeditState">编辑</el-button>
          <el-button :type="item.state ? 'success': ''" icon="el-icon-view" @click="banFunc(index)" :disabled="GeditState">禁用</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delFunc(index)" :disabled="GeditState">删除</el-button>
        </el-button-group>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="editState"
      width="80%"
      :before-close="editClose">
        <el-form :model="nowData" :rules="nowDataRules" ref="nowData" class="form-info" label-width="80px">
          <el-form-item label="孔号名称" prop="name">
            <el-input v-model="nowData.name"></el-input>
          </el-form-item>
          <el-form-item label="孔号">
            <el-input v-model="nowData.detail"></el-input>
          </el-form-item>
        </el-form>
        <h1 style="color: red;">注意！孔号不能重名。不能以“,”逗号结尾。孔名称之间必须已英文逗号“,”隔开。</h1>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editState = false">取 消</el-button>
        <el-button type="primary" @click="okFunc()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  const hole = {
    name: '',
    detail: '', // 孔明细
    state: true, // 启用禁用
  };
  export default {
    name: 'girderInfo',
    props: ['holes'],
    data: () => ({
      editState: false,
      editNumber: null,
      addState: false,
      title: '',
      nowData: {
        name: '',
        detail: '', // 孔明细
        state: true, // 启用禁用
      },
      nowDataRules: {
        name: [
          { required: true, message: '请输入孔号名称', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' },
        ],
      },
    }),
    computed: {
      // 编辑状态
      GeditState() {
        return !this.$store.state.global.editState;
      },
      holeShow() {
        return this.holes.map((item) => {
          return { name: item.name, state: item.state, detail: item.detail.split(',') };
        });
      },
    },
    methods: {
      addFunc() {
        this.title = '添加';
        this.editState = true;
        this.addState = true;
        this.nowData = this.$unity.copyObj(hole);
      },
      editFunc(index) {
        this.editNumber = index;
        this.title = '编辑';
        this.editState = true;
        this.nowData = this.$unity.copyObj(this.holes[index]);
      },
      // 禁用
      banFunc(index) {
        this.editNumber = index;
        this.nowData = this.$unity.copyObj(this.holes[index]);
        this.nowData.state = !this.nowData.state;
        this.save();
        this.$message.warning('已经禁用该孔号，在选择孔号时将不出现！');
      },
      delFunc(index) {
        this.$confirm('此操作将永久删除该孔号, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.holes.splice(index, 1);
          this.$emit('update:holes', this.holes);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
      },
      okFunc() {
        // console.log(s.size, cc.length, a);
        if (this.addState) {
          const i = this.holes.filter(v => v.name === this.nowData.name)[0];
          console.log(i);
          if (i) {
            this.$message.error('孔号名称已存在！请重新输入孔号！');
            return;
          }
        }
        const detailStr = this.nowData.detail.replace(/\s+/g, '');
        const detailArr = detailStr.split(',');
        const detailSet = new Set(detailArr);
        detailSet.delete('');
        if (detailSet.size < detailArr.length) {
          this.$confirm('设置孔号有误！不能有重名的孔号，不能以","（逗号）结尾', '提示！', {
            confirmButtonText: '继续修改',
            cancelButtonText: '自动处理保存',
            type: 'warning',
          }).then(() => {
            return null;
          }).catch(() => {
            this.nowData.detail = Array.from(detailSet).join(',');
            this.save();
          });
        } else {
          this.save();
        }
      },
      save() {
        if (this.addState) {
          this.holes.push(this.nowData);
        } else {
          this.$set(this.holes, this.editNumber, this.$unity.copyObj(this.nowData));
          // this.holes[this.editNumber] = this.$unity.copyObj(this.nowData);
        }
        console.log(this.addState, this.editNumber, this.nowData);
        this.editState = false;
        this.addState = false;
        this.$emit('update:holes', this.holes);
      },
      editClose() {
      },
    },
  };
</script>

<style lang="scss" scoped>
  .girder-info {
    display: flex;
    font-size: 24px;
    border-bottom: 1px solid #B4BCCC;
    .item1{
      flex: 0 0 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #B4BCCC;
    }
    .item2{
      flex: auto;
      padding: 10px;
    }
    .item3{
      flex: 0 0 312px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #B4BCCC;
    }
  }

</style>
<style lang="scss">
.girder-info{
  .el-tag--small{
    height: auto;
    padding: 0 8px;
    line-height: 30px;
    font-size: 24px;
  }
}
</style>

