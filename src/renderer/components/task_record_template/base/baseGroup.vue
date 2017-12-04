<template>
  <div class="wh100">
    <!-- 张拉分组 -->
    <el-radio-group class="zl-group">
      <el-radio-button :label="`上海${index}`" v-for="(item, index) in 50" :key="index"></el-radio-button>
    </el-radio-group>
  </div>
</template>


<style lang="scss">
.zl-group{
  padding: 5px 0px;
  margin-bottom: 15px;
  overflow-x: auto;
  display: flex;
  background-color: #EDF2FC;
}
</style>
