<template>
  <div>
    <el-dialog
      title="钢绞线选择"
      :visible="true"
      width="80%"
      >
      <div>
        构件选择
        <el-radio-group v-model="nowData" size="medium">
          <el-radio-button :label="item" v-for="(item, index) in datas" :key="index">{{item.specs}}</el-radio-button>
        </el-radio-group>
        <div v-if="nowData">
          <hr>
          钢绞线详情
           <el-table :data="[nowData]" style="width: 100%" border>
             <el-table-column prop="specs" label="钢绞线规格" ></el-table-column>
             <el-table-column prop="elasticityModulus" label="弹性模量" ></el-table-column>
             <el-table-column prop="prestress" label="控制应力KN" ></el-table-column>
             <el-table-column prop="reportNumber" label="报告编号" ></el-table-column>
             <el-table-column prop="demarcationDate" label="标定日期" ></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:show', false)">取 消</el-button>
        <el-button type="primary" @click="okFunc()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'steelStrand',
  props: ['show', 'steelStrandDataFunc'],
  data() {
    return {
      datas: null,
      nowData: null,
    };
  },
  beforeMount() {
    this.datas = this.$db.db('other').getCollection('steelStrands').data;
    console.log('01010202', this.datas);
  },
  methods: {
    okFunc() {
      if (this.nowData) {
        console.log(this.nowData.id);
        this.$emit('steelStrandDataFunc', this.nowData.id);
        this.$emit('update:show', false);
      } else {
        this.$message.error('请完成选择！');
      }
    },
  },
};
</script>
