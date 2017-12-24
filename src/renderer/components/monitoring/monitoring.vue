<template>
  <div class="wh100">
    <el-container class="wh100">
      <el-header height="40px">
        <router-link to="/menu">菜单</router-link>
        <el-button @click="bitOut(1280, true)">开</el-button>
        <el-button @click="bitOut(1280, false)">关</el-button>
        <el-button @click="get()">读</el-button>
        <el-button @click="writeMultipleCoil()">强制多线圈</el-button>
        <el-button @click="writeSingleRegister16()">写入单个16位寄存器</el-button>
        <el-button @click="reconnect()">重新连接</el-button>
      </el-header>
      <el-main>
        <div>
          <steps></steps>

          <table width="100%" border="1" cellspacing="0">
            <tr>
              <th>设备</th>
              <th>状态</th>
              <th>顶位移</th>
              <th>设备压力</th>
              <th>目标压力</th>
              <th>单顶伸长量</th>
              <th>单顶偏差率</th>
              <th>理论伸长量</th>
              <th>总伸长量</th>
              <th>总偏差率</th>
            </tr>
            <tr :class="item" v-for="(item, index) in ['A1', 'A2', 'B1', 'B2']" :key="index">
              <td>{{item}}</td>
              <td>状态</td>
              <td>顶位移</td>
              <td>设备压力</td>
              <td>目标压力</td>
              <td>单顶伸长量</td>
              <td rowspan="2" v-if="item === 'A1' || item === 'B1'">单顶偏差率</td>
              <td rowspan="2" v-if="item === 'A1' || item === 'B1'">理论伸长量</td>
              <td rowspan="2" v-if="item === 'A1' || item === 'B1'">总伸长量</td>
              <td rowspan="2" v-if="item === 'A1' || item === 'B1'">总偏差率</td>
            </tr>
          </table>
        </div>
        <div style="display: flex;">
          <!-- <veline style="flex:1;" title="压力曲线" max="60"></veline>
          <veline style="flex:1;" title="压力曲线" max="220"></veline> -->
        </div>
      </el-main>
      <el-footer height="40px">Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import Veline from '../task_record_template/base/veline';
import Steps from './steps/steps';
// // 创建TCP客户端
// const Client = new net.Socket();
// Client.setEncoding('utf8');
// Client.connect(502, '192.168.181.101');
// // 监听返回数据
// Client.on('data', (data) => {
//   console.log(data);
// });
// // 监听与服务端连接的错误事件
// Client.on('error', (error) => {
//   console.log(error);
//   Client.destroy();
// });
// Client.on('connect', (data) => {
//   console.log('连接成功！', data);
// });

export default {
  name: 'monitoring',
  components: {
    Veline,
    Steps,
  },
  data: () => ({
    mpas: [2, 3, 4, 5, 8, 10],
  }),

  methods: {
    bitOut(address, value) {
      // console.time('s');
      this.$plc1.writeSingleCoil(address, value, (data) => {
        console.log('PLC返回写入单线圈：', data);
      });
      // this.$plc1.readCoilStatue(1280, 5, (data) => {
      //   console.log('PLC返回的数据2', data);
      // });
      // this.$plc1.writeSingleCoil(address, false, (data) => {
      //   console.log('PLC返回的数据3', data);
      // });
      // this.$plc1.readCoilStatue(1280, 5, (data) => {
      //   console.log('PLC返回的数据4', data);
      // });
      // console.timeEnd('s');
    },
    get() {
      this.$plc1.readCoilStatue(1280, 5, (data) => {
        console.log('PLC返回读取多线圈', data);
      });
    },
    writeMultipleCoil() {
      this.$plc1.writeMultipleCoil(1280, [1, 0, 1, 0, 1], (data) => {
        console.log('PLC返回写入多线圈：', data);
      });
    },
    writeSingleRegister16() {
      this.$plc1.writeSingleRegister16(1536, 100, (data) => {
        console.log('PLC返回写入16位单寄存器：', data);
      });
    },
    reconnect() {
      this.$plc1.reconnect();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../css/variable.scss';

table{
  text-align: center;
  border: 0;
  th{
    border: 1px solid #CCC;
    font-size: 25px;
  }
  td{
    border: 1px solid #CCC;
    font-size: 25px;
    padding: 2px 5px;
  }
}
</style>
