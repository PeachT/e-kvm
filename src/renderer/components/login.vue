<template>
  <div class="home">
    <div class="top">
      <ul>
        <li v-if="users===0">没有数据</li>
        <li v-for="(item, index) in users" :key="index" :class="{'active': index===active}" @click="active = index">
          <img :src="item.img" alt="">
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="info">
        <img :src="nowData.img" alt="">
        <h1>{{nowData.name}}</h1>
      </div>
      <div class="login">
        <el-form label-width="110px" size="medium">
          <h1> 登录信息</h1>
          <el-form-item label="用 户">
            <el-autocomplete style="width:100%;" v-model="user.name" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
          </el-form-item>
          <el-form-item label="密 码">
            <el-input v-model="user.pwd"></el-input>
          </el-form-item>
          <el-form-item>
            <p style="color:#67C23A;" v-if="message === 1">登陆成功！</p>
            <p style="color:#FA5555;" v-if="message === 2">登陆错误！</p>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loginFunc()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="数据初始化" :visible.sync="dbState" width="100%" :before-close="dbInitClose">
      <el-form :model="admin" :rules="adminRules" ref="admin" label-width="120px">
        <el-form-item label="最高管理员名称"  prop="name">
          <el-input v-model="admin.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="admin.pwd" ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input v-model="admin.checkPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="adminSave">完 成</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'landing-page',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.admin.checkPwd !== '') {
            this.$refs.admin.validateField('checkPwd');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.admin.pwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dbState: true,
        active: 0,
        user: {
          name: 'admin',
          pwd: 'admin',
        },
        admin: {
          name: 'admin',
          pwd: 'admin',
          checkPwd: 'admin',
        },
        adminRules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
          ],
          pwd: [{ validator: validatePass, trigger: 'blur' }],
          checkPwd: [{ validator: validatePass2, trigger: 'blur' }],
        },
        message: '', // 1登陆成功 2登陆失败
        users: 0,
      };
    },
    beforeMount() {
      if (this.$db.init()) {
        this.dbState = false;
        try {
          const db = this.$db.dbBase('users');
          const users = db.getCollection('users');
          if (users) {
            this.users = users.data.map((item) => {
              return { name: item.name, img: item.img };
            });
          }
        } catch (error) { console.log('程序错误'); }
      }
    },
    computed: {
      // 当前选择的项目
      nowData() {
        // img: 'file:///C:/Users/peach/Pictures/%E4%B8%B4%E6%97%B6%E5%9B%BE%E7%89%87/vue.png',
        if (this.users === 0) {
          return {
            img: '',
            name: '没有数据',
          };
        }
        return this.usrs[this.active];
      },
      adminDb() {
        // 获取数据库
        const db = this.$db.dbBase('admin');
        let collection = db.getCollection('admin');
        if (!collection) {
          collection = db.addCollection('admin');
        }
        // 获取文档
        return { db: db, collection: collection };
      },
    },
    methods: {
      // 提示下拉框用户名
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
      // 登陆检测
      loginFunc() {
        const user = this.user;
        const admin = this.adminDb.collection.find({ name: user.name })[0];
        if (admin && user.pwd === admin.pwd) {
          this.$router.push({
            path: 'menu',
          });
          this.message = 1;
        } else {
          this.message = 2;
        }
      },
      // 数据库初始化保存
      adminSave() {
        this.$refs.admin.validate((valid) => {
          if (valid) {
            const adminCollection = this.adminDb.collection;
            const adminDb = this.adminDb.db;
            if (adminCollection.find({ name: this.admin.name })[0]) {
              this.$message({
                showClose: true,
                message: '管理员已经存在！',
                type: 'error',
              });
              return;
            }
            // 插入数据
            adminCollection.insert({
              name: this.admin.name,
              pwd: this.admin.pwd,
            });
            // 保存数据到数据库
            adminDb.save();
            this.$message.success('管理用添加成功！');
            this.dbState = false;
          } else {
            this.$message.error('输入有误！');
          }
        });
      },
      dbInitClose(done) {
        this.$message.error('必须完成设置！');
      },
    },
  };

</script>

<style scoped lang="scss">
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
        height: 120px;
        width: 120px;
        color: white;
        font-size: 24px;
        float: left;
        background-color: rgba(0, 0, 0, .5);
        padding: 15px 30px;
        border-right: 1px solid rgba(255, 255, 255, .5);
        &.active {
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
        background-color: white;
        flex: auto;
        text-align: center;
        img {
          padding-top: 100px;
          height: 360px;
        }
        h1 {
          padding-top: 50px;
          font-size: 90px;
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
      }
    }
  }

</style>

<style lang="scss">
  .login {
    .el-form-item__label {
      color: white;
    }
  }

</style>
