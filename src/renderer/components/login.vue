<template>
  <div class="home">
    <div class="top">
      <ul>
        <li v-if="users===0">没有数据</li>
        <li v-for="(item, index) in users" :key="index" :class="{'active': item.name===nowName}" @click="nowName = item.name">
          <div class="img">
            <img :src="item.img" alt="">
          </div>
          <div class="txt">
            <p>{{item.name}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="info">
        <div class="img">
          <img :src="nowData.img" alt="没有图片">
        </div>
        <div class="h1">
          <h1>{{nowData.name}}</h1>
        </div>
      </div>
      <div class="login">
        <el-form label-width="50px" size="medium">
          <h1> 登录信息</h1>
          <el-form-item label="用 户">
            <el-autocomplete style="width:100%;" v-model="user.name" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
          </el-form-item>
          <el-form-item label="密 码">
            <el-input v-model="user.pwd"></el-input>
          </el-form-item>
          <el-form-item>
            <h1 style="color:#67C23A;" v-if="message === 1">登陆成功！</h1>
            <h1 style="color:#FA5555;" v-if="message === 2">登陆错误！</h1>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loginFunc()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="数据初始化" :visible.sync="dbState" width="100%" :before-close="dbInitClose">

        <el-radio-group v-model="initState">
          <el-radio :label="false">创建新数据库</el-radio>
          <el-radio :label="true">导入已有数据库</el-radio>
        </el-radio-group>
        <div v-if="!initState">
          <el-form :model="adminInit" :rules="adminInitRules" ref="adminInit" label-width="120px">
            <el-form-item label="最高管理员名称"  prop="name">
              <el-input v-model="adminInit.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-input v-model="adminInit.pwd" ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPwd">
              <el-input v-model="adminInit.checkPwd"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <el-form :model="fileInit" :rules="fileInitRules" ref="fileInit" label-width="120px">
            <el-form-item label="选择目录地址" prop="path" >
              <el-input v-model="fileInit.path" :disabled="true"></el-input>
            </el-form-item>
            <el-button type="primary" @click="getDir()">导入数据库</el-button>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="initFunc(initState ? 'fileInit' : 'adminInit')">完 成</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  const { dialog } = require('electron').remote;
  export default {
    name: 'landing-page',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.adminInit.checkPwd !== '') {
            this.$refs.adminInit.validateField('checkPwd');
          }
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.adminInit.pwd) {
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
        initState: false,
        adminInit: {
          name: 'admin',
          pwd: 'admin',
          checkPwd: 'admin',
        },
        adminInitRules: {
          name: [
            { required: true, message: '请输入管理员名称', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
          ],
          pwd: [{ validator: validatePass, trigger: 'blur' }],
          checkPwd: [{ validator: validatePass2, trigger: 'blur' }],
        },
        fileInit: {
          path: null,
        },
        fileInitRules: {
          path: [
            { required: true, message: '请选择数据目录', trigger: 'blur' },
          ],
        },
        message: '', // 1登陆成功 2登陆失败
        nowName: null,
      };
    },
    beforeMount() {
      if (this.$db.ifDb) {
        this.dbState = false;
        window.adminDB = this.$db.mainDB.admin;
        window.usersDB = this.$db.mainDB.users;
        window.deviceDB = this.$db.systemDB.steelStrands;
        window.steelStrandsDB = this.$db.systemDB.device;
        window.girderDB = this.$db.systemDB.girder;
        window.systemDB = this.$db.systemDB.system;
        window.tplDB = this.$db.systemDB.tpl;
        window.manual = this.$db.systemDB.manual;
        window.nowDB = this.$db.nowDB.now;
      }
    },
    computed: {
      // 操作员数据
      users() {
        try {
          // const users = this.DBmain.getCollection('users').data;
          const users = window.usersDB.reverseGetAll();
          if (users.length > 0) {
            if (this.nowName === null) {
              this.nowName = users[0].projectName;
            }
            return users.map((item) => {
              return { name: item.projectName, img: item.logo, id: item.id };
            });
          }
        } catch (error) {}
        return 0;
      },
      // 当前选择的项目
      nowData() {
        // img: 'file:///C:/Users/peach/Pictures/%E4%B8%B4%E6%97%B6%E5%9B%BE%E7%89%87/vue.png',
        if (this.users === 0) {
          return {
            img: '',
            name: '没有数据',
          };
        }
        const nowName = this.nowName;
        this.$store.commit('user', window.usersDB.getOne({ projectName: nowName }));
        return this.users.filter(item => item.name === nowName)[0];
      },
    },
    methods: {
      // 提示下拉框用户名
      querySearch(queryString, cb) {
        try {
          let Results = [];
          // const users = this.DBmain.getCollection('admin').find({ permissions: { $lt: 9 } });
          const users = window.get({ permissions: { $lt: 9 } });
          Results = users.map((item) => {
            return { value: item.name };
          });
          // 调用 callback 返回建议列表的数据
          cb(Results);
        } catch (error) {}
      },
      // 登陆检测
      loginFunc() {
        const user = this.user;
        // const admin = this.DBmain.getCollection('admin').findOne({ name: user.name });
        const admin = window.adminDB.getOne({ name: user.name });
        if (admin && user.pwd === admin.pwd) {
          this.$store.commit('userDb', `${this.nowData.id}.tensioning`);
          this.$store.commit('operator', admin);
          this.$router.push({
            path: 'menu',
          });
          // 保存用户张拉数据
          window.tensioningDB = this.$db.db(`${this.nowData.id}.tensioning`);
          this.message = 1;
        } else {
          this.message = 2;
        }
      },
      // 数据库初始化保存
      initFunc(ref) {
        this.$refs[ref].validate((valid) => {
          if (valid) {
            if (this.$db.init(
              this.initState, this.fileInit.path, this.adminInit,
            )) {
              // this.$message.success('数据库初始化完成!');
              this.$notify.success({
                title: 'Info',
                message: '数据库初始化完成! 请稍后...',
                showClose: false,
              });
              // 相对于刷新当前页面
              this.$router.go(0);
            } else {
              this.$message.error('数据库初始化失败');
            }
          } else if (ref === 'adminInit') {
            this.$message.error('输入有误！');
          } else {
            this.$message.error('请选择数据库所在目录！');
          }
        });
      },
      dbInitClose(done) {
        this.$message.error('必须完成设置！设备才能正常使用，请完成设置！');
      },
      // 选择数据库文件夹
      getDir() {
        this.fileInit.path = dialog.showOpenDialog({ properties: ['openDirectory'] })[0];
        console.log(this.fileInit.path);
      },
    },
  };

</script>

<style scoped lang="scss">
  .home {
    color: #5a5e66;
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
        padding: 15px 15px;
        border-right: 1px solid rgba(255, 255, 255, .5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
        animation: fadein2 ease-in .5s;
        &.active {
          animation: fadein ease-in .5s;
          animation-fill-mode: forwards;
          // opacity: 1;
          color: #5a5e66;
          background-color: white;
          img {
            box-shadow: 2px 2px 3px #5a5e66;
          }
          box-shadow: 2px 2px 3px #ccc;
        }
        .img{
          img{
            height: 96px;
            width: 96px;
          }
        }
        .txt{
          padding-top: 5px;
        }
      }
    }
    .main {
      display: flex;
      flex: auto;
      height: 100%;
      margin: 3%;
      .info {
        flex: auto;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .img {
          flex: 3;
          img{
            padding-top: 50px;
            height: 320px;
            width: 100%;
            max-width: 320px;
          }
        }
        .h1 {
          padding-top: 15px;
          flex: 2;
          font-size: 32px;
        }
      }
      .login {
        padding-left: 35px;
        width: 500px;
        color: white;
        h1 {
          padding-bottom: 50px;
          margin-left: 50px;
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
