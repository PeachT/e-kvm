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
          <el-tabs v-model="activeName2" type="card">
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
        <div class="user-item">
          <h3>操作员信息</h3>
          <el-tabs v-model="activeName2" type="card">
            <el-tab-pane label="用户管理" v-for="(item, index) in 5" :key="index"></el-tab-pane>
          </el-tabs>
          <div class="img-text">
            <div style="width:300px;">
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
        </div>
        <div class="user-item">
          <h3>钢绞线信息</h3>
          <el-tabs v-model="activeName2" type="card">
            <el-tab-pane label="用户管理" v-for="(item, index) in 5" :key="index"></el-tab-pane>
          </el-tabs>
          <el-form label-width="85">
            <div class="row-flex">
              <el-form-item :label="item[1]"
                v-for="(item, index) in [['gjxgg','钢绞线规格'],['txml', '弹性模量'],['kzyl', '控制应力KN'],['bgbh', '报告编号']]"
                :key="index">
                <el-input ></el-input>
              </el-form-item>
              <el-form-item label="标定日期">
                <el-date-picker style="width:100%;" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="user-item">
          <h3>混泥土信息</h3>
           <el-form label-width="85">
            <div class="row-flex">
              <el-form-item :label="item[1]"
                v-for="(item, index) in [['skqd', '试块强度'],['sjqd', '设计强度'],['zlqd', '张拉强度']]"
                :key="index">
                <el-input ></el-input>
              </el-form-item>
            </div>
          </el-form>
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
