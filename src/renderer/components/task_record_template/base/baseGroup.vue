<template>
  <div class="wh100">
    <!-- 张拉分组 -->
    <el-radio-group :value="name"  class="zl-group">
      <el-radio-button :label="item.name" v-for="(item, index) in groups" :key="index" @click.native="$emit('update:nowGroupName', item.name)">
        <i :class="`g${item.state}`"></i>{{item.name}}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
  export default {
    name: 'baseGroup',
    props: ['groups', 'nowGroupName'],
    computed: {
      name() {
        return this.nowGroupName;
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
    .el-radio-button__inner{
      i{
        height: 3px;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        &.g0{
          background-color: #909399;
        }
        &.g1{
          background-color: #67C23A;
          animation: 2s rainbow infinite alternate;
        }
        &.g2{
          background-color: #E6A23C;
        }
        &.g3{
          background-color: #F56C6C;
        }
      }
    }
  }
</style>
