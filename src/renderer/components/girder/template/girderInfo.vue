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
          <el-button type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button type="primary" icon="el-icon-share">添加</el-button>
          <el-button type="warning" icon="el-icon-delete">禁用</el-button>
        </el-button-group>
      </div>
    </div>
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
    }),
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
      flex: 0 0 239px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #B4BCCC;
    }
  }

</style>

