<template>
  <div class="steps">
    <div
      class="item"
      :class="{'active': active >= index, 'active-ok': active > index || jd.length === index+1, 'flex-1': jd.length === index+1}"
      v-for="(item, index) in jd" :key="index"
    >
      <div class="main">
        <div class="text">
          <span>{{item}}</span>
          <i class="el-icon-loading" v-show="active*1 === index"></i>
        </div>
        <div class="line" v-if="jd.length > index+1" >
          <el-progress :percentage="50" :show-text="false" status="success" :stroke-width="25"></el-progress>
          <div class="line-top">
            {{jd.length}}/{{index+1}}
          </div>
        </div>
      </div>
      <!-- <div class="info">
        持荷时间：<span>123456</span>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'steps',
  data: () => ({
    active: 0,
    jd: ['初张拉', '阶段一', '阶段二', '阶段三', '终张拉', '超张拉', '卸荷', '完成'],
  }),
};
</script>


<style lang="scss" scoped>
  .steps {
    display: flex;
    .flex-1{
      flex: 1;
    }
    // &>div {
    //   flex: 1;
    // }
    .item {
      width: 100%;
      display: flex;
      align-items: center;
      color: rgb(180, 188, 204);
      &>div{
        width: 100%;
      }
      .main{
        display: flex;
        align-items: center;
        .line {
          flex: auto; // height: 2px;
          position: relative;
          .line-top{
            position: absolute;
            top: 2px;
            width: 100%;
            text-align: center;
            font-size: 20px;
          }
        }
        .text {
          font-size: 24px;
          border: 2px solid rgb(180, 188, 204);
          border-radius: 80px;
          text-align: center;
          line-height: 80px;
          height: 80px;
          width: 80px;
          font-weight: 700;
          position: relative;
        }
      }
      &.active{
        color: black;
        .text{
          border-color:#67C23A;
          i{
            color:#67C23A;
            position: absolute;
            top: 0px;
            left: 0px;
            font-size: 80px;
            z-index: -1;
          }
        }
        &.active-ok{
          .text{
            background-color: #67C23A;
            color: white;
          }
        }
      }
    }
  }

</style>

