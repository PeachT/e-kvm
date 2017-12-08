<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-aside width="50%">
        <el-form label-width="90px">
          <el-form-item :label="item[1]"
            v-for="(item, index) in templateName":key="index">
            <el-input></el-input>
          </el-form-item>
        </el-form>
      </el-aside>
      <el-main class="flex-column">
        <div class="user-item">
          <h3>监理信息</h3>
          <el-tabs type="card">
            <el-tab-pane label="用户管理" v-for="(item, index) in 5" :key="index"></el-tab-pane>
          </el-tabs>
          <div class="img-text">
            <div style="width:300px;">
              <img src="" alt="没有图片">
            </div>
            <div>
              <el-form label-width="90px">
                <el-form-item label="监理姓名">
                  <el-input></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'userInfo',
  data: () => ({
    templateName: [
      ['xmmc', '项目名称'],
      ['gcmc', '工程名称'],
      ['sgdw', '施工单位'],
      ['yzlc', '预制梁厂'],
      ['jldw', '监理单位'],
      ['dwgc', '单位工程'],
      ['fbgc', '分部工程'],
      ['fxgc', '分项工程'],
      ['htbh', '土建合同号'],
      ['yzhfw', '压桩号范围'],
      ['gcbw', '工程部位'],
    ],
  }),
};
</script>

<style lang="scss">
.user-item{

  display: flex;
  flex-direction: column;
  h3{
    background-color: #EDF2FC;
    padding: 10px 5px;
  }
  .img-text{
    display: flex;
    height: 220px;
    align-items: center;
    &>div{
      display: flex;
      justify-content: center;
      img{
        height: 200px;
        width: 200px;
        border: 1px dashed #D8DCE5;
      }
    }
  }
}
</style>
