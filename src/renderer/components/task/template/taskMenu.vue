<template>
  <div class="wh100 task-menu-template">
    <el-container class="wh100">
      <el-header height="40px" class="teak-header">
        <el-button-group >
          <el-button type="success" >添加</el-button>
          <el-button type="primary" >编辑</el-button>
          <el-button type="primary" >下载</el-button>
          <el-button type="danger" >删除</el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <div class="glub" :class="{'active' : active === index}" v-for="(item, index) in 5" :key="index" v-show="active===null || active === index" @click.stop="activeFunc(index)">
          <div class="title" :class="{'active' : active === index}">
            <div><i class="el-icon-delete"></i>文字描述{{item}}</div>
            <div :class="{'active' : active === index}"><i class="el-icon-arrow-up" ></i></div>
          </div>
          <div class="items" v-show=" active === index">
              <li class="item" :class="{'active' : activeItem === index}" v-for="(item, index) in 50" :key="index" @click.stop="activeItemFunc(index)">
                <i class="el-icon-delete"></i>
                <span>
                  {{'123456kkkl'+item}}
                  {{'123456kkkl'+item}}
                </span>
              </li>
          </div>
        </div>
      </el-main>
      <el-footer height="33px">
        <el-checkbox-group class="task-footer">
          <el-checkbox-button v-for="(item, index) in ['未张拉', '张拉中', '已张拉']" :label="item" :key="index">{{item}}</el-checkbox-button>
        </el-checkbox-group>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
export default {
  name: 'taskmenu',
  data: () => ({
    active: null,
    activeItem: null,
  }),
  watch: {
    active(nval) {

    },
  },
  methods: {
    activeFunc(index) {
      const state = this.active === index;
      if (state) {
        this.active = null;
      } else {
        this.active = index;
        this.activeItem = 0;
      }
    },
    activeItemFunc(index) {
      const state = this.activeItem === index;
      if (!state) {
        this.activeItem = state === index ? null : index;
        this.$message(`${this.active}--${index}`);
      }
    },
  },
};
</script>
<style lang="scss" >
.task-menu-template{
  header{
    border-bottom:1px solid #EDF2FC;
  }
  main{
    overflow: hidden;
  }
  footer{
    border-top:1px solid #EDF2FC;
  }
  .teak-header{
    button{
      height: 40px;
    }
  }
  .task-footer{
    display: flex;
    justify-content: center;
  }
  .glub{
    border-bottom:1px solid #EDF2FC;
    &.active{
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .title{
      &.active{
        background-color: #409EFF;
        color: white;
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding:0 5px;
      height: 46px;
      font-size: 22px;
      border-bottom:1px solid #EDF2FC;
      .active{
        transform: rotate(90deg);
        transform: .3s;
      }
    }
    .items{
      // height: 0;
      // transition: height .3s ease-in-out,padding-top .3s ease-in-out,padding-bottom .3s ease-in-out;
      // overflow: hidden;
      overflow-y: auto;
      height: 100%;
      .item{
        padding: 15px 10px 10px;
        font-size: 22px;
        display: flex;
        align-items: center;
        border-bottom:1px solid #EDF2FC;
        &.active{
          background-color: #EDF2FC;
        }
        i{
          margin-right: 5px;
        }
      }
    }
  }
  // .el-collapse-item__arrow{
  //   margin: 0;
  // }
}
</style>

