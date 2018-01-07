<template>
  <div class="steps">
     <div
      class="item"
      :class="{'active': nowStage >= index+1, 'active-ok': nowStage > index+1, 'flex-1': index+2 >= stageArr.length}"
      v-for="(item, index) in stageArr" :key="index"
    >
      <div class="main">
        <div class="text" :class="{'rainbow': nowStage*1 === index+1}">
          <span>{{item}}</span>
          <!-- <i class="el-icon-loading" v-show="active*1 === index"></i> -->
        </div>
        <div class="line" v-if="index+2 < stageArr.length" >
          <el-progress :percentage="(recirdTime[index] / times[index]) * 100" :show-text="false" status="success" :stroke-width="25"></el-progress>
          <div class="line-top">
            {{recirdTime[index]}}/{{times[index]}}
          </div>
        </div>
      </div>
      <!-- <div class="info">
        持荷时间：<span>123456</span>
      </div> -->
      <p hidden="hidden">{{tAB}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'steps',
  props: ['stage', 'nowStage', 'times', 'recirdTime', 'tAB'],
  data: () => ({
    active: 0,
    jd: ['初张拉', '阶段一', '阶段二', '阶段三', '终张拉', '超张拉', '卸荷', '完成'],
  }),
  computed: {
    stageArr() {
      let arr = this.stage;
      if (arr.length > 0) {
        arr.push('卸荷', '完成');
      } else {
        arr = ['没有数据'];
      }
      return arr;
    },
  },
  watch: {
    tAB(nval) {
    },
  },
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
          border-radius: 40px;
          text-align: center;
          line-height: 40px;
          height: 40px;
          width: 100px;
          font-weight: 700;
          position: relative;
        }
      }
      &.active{
        color: black;
        .text{
          border-color:#67C23A;
        }
        &.active-ok{
          .text{
            background-color: #67C23A;
            color: white;
          }
        }
      }
    }
    .rainbow{
      animation: 2s rainbow infinite alternate;
      color: #67C23A;
    }
  }
  @keyframes rainbow {
  0% { opacity: 1 }
  to { opacity: .3 }
}
</style>

