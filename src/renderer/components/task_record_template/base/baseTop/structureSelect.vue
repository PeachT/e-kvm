<template>
  <div>
    <el-dialog
      title="构件孔选择"
      :visible="true"
      width="80%"
      >
      <div>
        构件选择
        <el-radio-group v-model="structureSelectData" size="medium">
          <el-radio-button :label="item" v-for="(item, index) in structureData" :key="index">{{item.name}}</el-radio-button>
        </el-radio-group>
        <div v-if="structureSelectData">
          <hr>
          孔选择
          <el-radio-group v-model="hole" size="medium" >
            <el-radio-button :label="item" v-for="(item, index) in structureSelectData.holes" :key="index">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="hole">
          <hr>
          孔明细
          <el-tag v-for="(item, index) in holes" :key="index" size="medium ">{{item}}</el-tag>
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
  name: 'structureSelect',
  props: ['show', 'holeDataFunc'],
  data() {
    return {
      structureSelectData: null,
      hole: null,
      structureData: [],
    };
  },
  computed: {
    holes() {
      return this.hole.detail.split(',');
    },
  },
  beforeMount() {
    this.structureData = this.$db.db('other').getCollection('girder').data.map((item) => {
      return { name: item.name, id: item.id, holes: item.holes };
    });
  },
  methods: {
    okFunc() {
      if (this.structureSelectData && this.hole) {
        this.$emit('holeDataFunc', this.hole.id);
        this.$emit('update:show', false);
      } else {
        this.$message.error('请完成选择！');
      }
    },
  },
};
</script>
