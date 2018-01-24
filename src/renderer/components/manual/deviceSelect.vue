<template>
  <div>
    <el-dialog
      title="设备选择"
      :visible="true"
      width="80%"
      :before-close="close"
      >
      <div>
        设备选择
        <el-radio-group v-model="data" size="medium">
          <el-radio-button :label="item" v-for="(item, index) in datas" :key="index">{{item.name}}</el-radio-button>
        </el-radio-group>
        <div v-if="data">
          <hr>
          模式选择
          <el-radio-group size="medium">
            <el-radio-button :label="item"
              v-for="(item, index) in data.tensioningPattern"
              :key="index">{{tensioningPatternStr[item]}}</el-radio-button>
          </el-radio-group>
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
  props: ['show', 'deviceId'],
  data() {
    return {
      tensioningPatternStr: ['A1单顶', 'A两顶', 'B1单顶', 'B两顶', '四顶'],
      data: null,
      datas: [],
    };
  },
  beforeMount() {
    this.datas = window.deviceDB.reverseGetAll().map((item) => {
      return item;
    });
  },
  methods: {
    okFunc() {
      if (this.data) {
        this.$emit('update:deviceId', this.data.id);
        this.close();
      } else {
        this.$message.error('请完成选择！');
      }
    },
    close() {
      this.$emit('update:show', false);
    },
  },
};
</script>
