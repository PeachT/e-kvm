<template>
  <div class="wh100 task-record">
    <el-container class="wh100">
      <el-aside class="task-record-menu" width="224px">
        <menu-one></menu-one>
      </el-aside>
      <el-main class="task-record-main">
        <el-tabs>
          <el-tab-pane label="基础信息">
            <base-top></base-top>
            <base-group></base-group>
            <base-tendon-data></base-tendon-data>
            <base-record-data></base-record-data>
            <base-svg></base-svg>
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
  import BaseTop from '../task_record_template/base/baseTop.vue';
  import BaseGroup from '../task_record_template/base/baseGroup.vue';
  import BaseTendonData from '../task_record_template/base/baseTendonData.vue';
  import BaseRecordData from '../task_record_template/base/baseRecordData.vue';
  import BaseSvg from '../task_record_template/base/svg.vue';
  import OtherInfo from '../task_record_template/otherInfo.vue';
  import MenuOne from '../menus/menuOne.vue';
  import DeviceInfo from '../device/template/deviceInfo.vue';
  import UserInfo from '../user/template/userInfo.vue';

  export default {
    name: 'task',
    components: {
      MenuOne,
      BaseTop,
      BaseGroup,
      BaseTendonData,
      BaseRecordData,
      BaseSvg,
      DeviceInfo,
      OtherInfo,
      UserInfo,
    },
    data: () => ({
    }),
  };

</script>

