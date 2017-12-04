<template>
  <div class="wh100 menu-template">
    <el-container class="wh100">
      <el-header height="40px" class="header">
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
        <el-checkbox-group class="footer">
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
