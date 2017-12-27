<template>
  <div>
    <el-form label-width="100px"
    v-loading="!PLCState1"
    element-loading-text="请连接设备获取参数"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="plcLoad">
      <h3 style="background-color: rgb(245, 247, 250);">PLC系统参数</h3>
      <div class="row-flex">
        <el-form-item label="压力上限">
          <el-input v-model="plc.ceiling">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="压力偏差">
          <el-input v-model="plc.lower">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="油泵延时">
          <el-input v-model="plc.delay">
            <i slot="suffix">s</i>
          </el-input>
        </el-form-item>
        <el-form-item label="超设置压力">
          <el-input v-model="plc.superSetPressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="允许回程压力">
          <el-input v-model="plc.returnPressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
      </div>
      <div class="row-flex">
        <el-form-item label="补压参数">
          <el-input v-model="plc.replenish">
            <i slot="suffix">%</i>
          </el-input>
        </el-form-item>
        <el-form-item label="">
        </el-form-item>
        <el-form-item label="">
        </el-form-item>
        <el-form-item label="">
        </el-form-item>
        <el-form-item label="">
        </el-form-item>
      </div>
      <div class="row-flex">
        <div>
          <el-button style="float: right;" type="">刷新</el-button>
          <el-button style="float: right;" type="">保存</el-button>
        </div>
      </div>
    </el-form>
    <el-form label-width="130px" :model="control" ref="control">
      <h3 style="background-color: rgb(245, 247, 250);">控制参数</h3>
      <div class="row-flex">
        <el-form-item :label="item[0]" :prop="item[1]"
        v-for="(item, index) in [['总位移偏差上限','deviationCeiling'],['总位移偏差下限','deviationLower'],['平衡控制','balance']]" :key="index"
        :rules="[
          { required: true, message: '参数不能为空'},
          { type: 'number', message: '参数必须为数字值'}
        ]">
          <el-input v-model.number="control[item[1]]">
            <i slot="suffix">%</i>
          </el-input>
        </el-form-item>
      </div>
      <div class="row-flex">
        <div>
          <el-button style="float: right;" type="" @click="controlSave()">保存</el-button>
        </div>
      </div>
    </el-form>
    <el-form label-width="130px" :model="sensor" ref="sensor">
      <h3 style="background-color: rgb(245, 247, 250);">传感器参数</h3>
      <div class="row-flex">
        <el-form-item :label="item[0]" :prop="item[1]"
        v-for="(item, index) in [['压力传感器参数','pressure'],['PLC压力值','pressurePLC'],['位移传感器参数','displacement'],['PLC位移值','displacementPLC']]" :key="index"
        :rules="[
          { required: true, message: '参数不能为空'},
          { type: 'number', message: '参数必须为数字值'}
        ]">
          <el-input v-model.number="sensor[item[1]]" type="number"></el-input>
        </el-form-item>
      </div>
      <div class="row-flex">
        <div>
          <el-button style="float: right;" type="" @click="sensorSave()">保存</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'System',
    data: () => ({
      plc: {
        ceiling: null, // 上限
        lower: null, // 下限
        delay: null, // 油泵延时
        superSetPressure: null, // 超设置压力
        returnPressure: null, // 回程压力
        replenish: null, // 补压压力
      },
      control: {
        deviationCeiling: null, // 运行总位移上限
        deviationLower: null, // 允许总位移下限
        balance: null, // 平衡控制
      },
      sensor: {
        displacement: null, // 位移传感器
        displacementPLC: null,
        pressure: null, // 压力传感器
        pressurePLC: null,
      },
    }),
    computed: {
      PLCState1() {
        return this.$store.state.global.PLC1State;
      },
      PLCState2() {
        return this.$store.state.global.PLC2State;
      },
    },
    beforeMount() {
      this.getSys();
    },
    methods: {
      getSys() {
        this.sensor = window.systemDB.getOne({ name: 'sensor' });
        this.control = window.systemDB.getOne({ name: 'control' });
        console.log(window.systemDB.getAll);
      },
      sensorSave() {
        this.$refs.sensor.validate((valid) => {
          if (valid) {
            window.systemDB.update(this.sensor);
            this.$message.success('修改保存成功！');
          } else {
            const msg = '输入有误！请按规定输入！';
            this.$message.error(msg);
          }
        });
      },
      controlSave() {
        this.$refs.control.validate((valid) => {
          if (valid) {
            window.systemDB.update(this.control);
            this.$message.success('修改保存成功！');
          } else {
            const msg = '输入有误！请按规定输入！';
            this.$message.error(msg);
          }
        });
      },
    },
  };

</script>

<style lang="scss">
.plcLoad{
  .el-loading-mask{
    z-index: 1;
    i,p{
      font-size: 32px;
    }
  }
}
</style>
