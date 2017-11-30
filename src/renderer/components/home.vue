<template>
  <div class="home">
    <div class="top">
      <ul>
        <li v-for="(item, index) in 5" :key="index" :class="{'active': index===active}" @click="active = index">
          <img src="../assets/logo.png" alt="">
          <p>管理员{{item}}</p>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="info">
        <div>
          <img :src="nowData.img" alt="">
          <h1>{{nowData.name}}</h1>
        </div>
      </div>
      <div class="login">
        <el-form label-width="110px" size="medium">
          <h1> 登录信息</h1>
          <el-form-item label="用 户">
            <el-autocomplete style="width:100%;" :fetch-suggestions="querySearch" placeholder="请输入内容" ></el-autocomplete>
          </el-form-item>
          <el-form-item label="密 码">
            <el-input></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import LocalImg from './local-img.vue';
  export default {
    name: 'landing-page',
    components: { LocalImg },
    data: () => ({
      active: 0,
    }),
    computed: {
      // 当前选择的项目
      nowData() {
        return {
          img: 'file:///C:/Users/peach/Pictures/%E4%B8%B4%E6%97%B6%E5%9B%BE%E7%89%87/vue.png',
          name: this.active,
        };
      },
    },
    methods: {
      querySearch(queryString, cb) {
        const Results = [
          {
            value: '张三',
          },
          {
            value: '李四',
          },
        ];
        // 调用 callback 返回建议列表的数据
        cb(Results);
      },
    },
  };

</script>

<style lang="scss">
  .home {
    background-image: url(../assets/background-image.png);
    background-repeat: no-repeat;
    background-size: cover;
    max-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .top {
      width: 100%; // background-color: white;
      ul {
        padding: 3%;
        li:last-child {
          border: 0;
        }
      }
      li {
        color: white;
        font-size: 24px;
        float: left;
        background-color: rgba(0, 0, 0, .5);
        padding: 15px 30px;
        border-right: 1px solid rgba(255, 255, 255, .5);
        &.active{
          color: black;
          background-color: white;
        }
      }
      img {
        height: 64px;
        width: 64px;
      }
    }
    .main {
      display: flex;
      flex: auto;
      height: 100%;
      margin: 3%;
      .info {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        flex: auto;
        text-align: center;
        img {
          height: 128px;
          width: 128px;
        }
      }
      .login {
        padding: 0 0 50px 50px;
        width: 500px;
        color: white;
        h1 {
          padding-bottom: 50px;
          margin-left: 100px;
          text-align: center;
        }
        .el-form-item__label {
          color: white;
        }
      }
    }
  }

</style>

