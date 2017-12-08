<template>
  <div>
    <div class="girder-info title">
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
      <div class="item3">操作</div>
    </div>
    <div v-for="(item, index) in tableData" :key="index" class="girder-info item">
      <div class="item1">{{item.name}}</div>
      <div class="item2">
        <el-tag v-for="(hole, index2) in item.hole" :key="index2">{{hole}}</el-tag>
      </div>
      <div class="item3">
        <el-button-group>
          <el-button type="success" icon="el-icon-plus" @click="addFunc">添加</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="editFunc">编辑</el-button>
          <el-button type="warning" icon="el-icon-view" @click="banFunc">禁用</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delFunc">删除</el-button>
        </el-button-group>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="editState"
      width="80%"
      :before-close="editClose">
        <el-form class="form-info" label-width="80px">
          <el-form-item label="孔号名称">
            <el-input ></el-input>
          </el-form-item>
            <el-form-item label="孔号">
              <div class="row-flex" style="flex-wrap: wrap;">
                <el-input style="flex: 0 0 110px;" v-model="editData.holes[index]" v-for="(item, index) in holes" :key="index"></el-input>
              </div>
            </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editState = false">取 消</el-button>
        <el-button type="primary" @click="editState = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'girderInfo',
    data: () => ({
      tableData: [{
        name: '3',
        hole: ['1', '2', '3'],
      }, {
        name: '4',
        hole: ['1', '2', '3', '4'],
      }, {
        name: '5',
        hole: ['1', '2', '3', '4', '5'],
      }, {
        name: '6',
        hole: ['1', '2', '3', '4', '5', '6'],
      }, {
        name: '7',
        hole: ['1', '2', '3', '4', '5', '6', '7'],
      }],
      editState: false,
      title: '',
      editData: {
        name: '',
        holes: [],
      },
    }),
    computed: {
      holes() {
        const holes = this.editData.holes;
        if (holes[holes.length - 1] !== '') {
          console.log(holes);
          holes.push('');
        } else if (holes[holes.length - 1] === '' && holes[holes.length - 2] === '') {
          console.log(holes);
          holes.pop();
        }
        console.log(holes);
        return holes;
      },
    },
    methods: {
      addFunc() {
        this.title = '添加';
        this.editState = true;
      },
      editFunc() {
        this.title = '编辑';
        this.editState = true;
      },
      banFunc() {
        this.$message.warning('已经禁用该孔号，在编辑是将不再出现！');
      },
      delFunc() {
        this.$confirm('此操作将永久删除该孔号, 是否继续?', '提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
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
      // 编辑框显示
      editClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => done())
          .catch();
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

