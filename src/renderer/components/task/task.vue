<template>
  <div class="wh100 task">
    <el-container class="wh100">
      <el-aside class="task-menu" width="224px">
        <task-menu></task-menu>
      </el-aside>
      <el-main class="task-main">
        <el-tabs>
          <el-tab-pane label="基础信息">
            <task-base></task-base>
          </el-tab-pane>
          <el-tab-pane label="设备消息">
            <device-info></device-info>
          </el-tab-pane>
          <el-tab-pane label="钢绞线/混泥土">
            <other-info></other-info>
          </el-tab-pane>
          <el-tab-pane label="用户信息">
            <user-info></user-info>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import TaskMenu from './template/taskMenu.vue';
  import TaskBase from './template/taskBase.vue';
  import DeviceInfo from './template/deviceInfo.vue';
  import OtherInfo from './template/otherInfo.vue';
  import UserInfo from './template/userInfo.vue';

  export default {
    name: 'task',
    components: {
      TaskMenu, TaskBase, DeviceInfo, OtherInfo, UserInfo,
    },
    data: () => ({
    }),
  };

</script>

<style lang="scss">
  .task {
    .task-menu {
      border-right: 1px solid #EDF2FC;
    }
    .task-main{
      &>div{
        height: 100%;
        display: flex;
        flex-direction: column;
        .el-tabs__content{
          height: 100%;
          .el-tab-pane{
            height: 100%;
          }
        }
      }
    }
  }
  .row-flex{
    display: flex;
    &>div{
      flex:1;
    }
  }
</style>
