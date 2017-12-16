<template>
  <div class="wh100">
    <!-- 张拉分组 -->
    <el-radio-group v-model="name" class="zl-group">
      <el-radio-button :label="item" v-for="(item, index) in groups" :key="index"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    name: 'baseGroup',
    props: ['groups', 'nowGroupName'],
    data() {
      return {
        name: this.nowGroupName,
      };
    },
    watch: {
      name(nval) {
        this.$emit('update:nowGroupName', nval);
      },
    },
  };
</script>

<style lang="scss">
  .zl-group {
    padding: 5px 0px;
    margin-bottom: 15px;
    overflow-x: auto;
    display: flex;
    background-color: #EDF2FC;
  }
</style>
