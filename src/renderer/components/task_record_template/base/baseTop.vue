<template>
  <div class="wh100">
    <!--  -->
    <el-form class="form-info" label-width="80px">
      <div class="text-info">
        <div class="row-flex">
          <el-form-item label="构件名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="构件/孔号">
            <div class="row-flex">
              <el-input>
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
              <el-input>
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="设 备">
            <div class="row-flex">
              <el-input>
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
              <el-button>分组</el-button>
            </div>
          </el-form-item>
        </div>
        <div class="row-flex">
          <el-form-item label="梁 号">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="钢绞线">
            <div class="row-flex">
              <el-input>
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </div>
        <div class="row-flex">
          <el-form-item label="浇筑日期">
            <el-date-picker style="width:100%;" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="张拉强度">
            <el-input>
              <i slot="suffix" class="el-input__icon">Mpa</i>
            </el-input>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </div>
      </div>
      <div class="img-info">
        <img src="" alt="没有图片">
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'main',
    data: () => ({
      ccc: 0,
      value: '',
    }),
  };

</script>

<style lang="scss">
.form-info{
  display: flex;
  .text-info{
    flex: auto;
  }
  .img-info{
    width: 210px;
    margin: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
