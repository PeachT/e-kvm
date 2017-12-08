<template>
  <div class="wh100 operator">
    <div class="img">
      <img src="" alt="没有图片">
    </div>
    <div>
      <el-form label-width="90px">
        <el-form-item label="操作员姓名">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="登陆密码">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'operatorInfo',
};
</script>

<style lang="scss" scoped>
.operator{
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    height: 200px;
    width: 200px;
    border: 1px dashed #D8DCE5;
  }
}
</style>


