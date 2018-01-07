<template>
  <div>
    <el-form
      label-width="100px"
      v-loading="!PLCState1"
      element-loading-text="请连接设备获取参数"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="plcLoad">
      <h3 style="background-color: rgb(245, 247, 250);">主站PLC系统参数</h3>
      <div class="row-flex">
        <el-form-item label="压力上限">
          <el-input type="number" v-model="plc1.ceiling">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="允许压力偏差">
          <el-input type="number" v-model="plc1.differencePressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="超设置压力">
          <el-input type="number" v-model="plc1.superSetPressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="允许回程压力">
          <el-input type="number" v-model="plc1.returnPressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="油泵延时">
          <el-input  type="number" v-model="plc1.delay">
            <i slot="suffix">s</i>
          </el-input>
        </el-form-item>
      </div>
      <div class="row-flex">
        <el-form-item label="补压参数">
          <el-input  type="number" v-model="plc1.replenish">
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
          <el-button style="float: right;" type="" @click="plcSave(1)">保存</el-button>
        </div>
      </div>
    </el-form>
    <el-form
      label-width="100px"
      v-loading="!PLCState1"
      element-loading-text="请连接设备获取参数"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="plcLoad">
      <h3 style="background-color: rgb(245, 247, 250);">从站PLC系统参数</h3>
      <div class="row-flex">
        <el-form-item label="压力上限">
          <el-input type="number" v-model="plc2.ceiling">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="允许压力偏差">
          <el-input type="number" v-model="plc2.differencePressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="超设置压力">
          <el-input type="number" v-model="plc2.superSetPressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="允许回程压力">
          <el-input type="number" v-model="plc2.returnPressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="油泵延时">
          <el-input  type="number" v-model="plc2.delay">
            <i slot="suffix">s</i>
          </el-input>
        </el-form-item>
      </div>
      <div class="row-flex">
        <el-form-item label="补压参数">
          <el-input  type="number" v-model="plc2.replenish">
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
          <el-button style="float: right;" type="" @click="plcSave(2)">保存</el-button>
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
      <div class="row-flex" :rules="[
          { required: true, message: '参数不能为空'},
          { type: 'number', message: '参数必须为数字值'}
        ]">
        <el-form-item label="显示小数点位数">
          <el-input v-model.number="sensor.toFixed" type="number"></el-input>
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
  const returnData16 = require('../../modbus-tcp/returnData').default.returnData16;
  export default {
    name: 'System',
    data: () => ({
      plc1: {
        ceiling: null, // 上限
        differencePressure: null, // 运行压力差
        superSetPressure: null, // 超设置压力
        returnPressure: null, // 回程压力
        delay: null, // 油泵延时
        replenish: null, // 补压压力
      },
      plc2: {
        ceiling: null, // 上限
        differencePressure: null, // 运行压力差
        superSetPressure: null, // 超设置压力
        returnPressure: null, // 回程压力
        delay: null, // 油泵延时
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
        toFixed: null,
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
      if (this.$store.state.global.PLC1State) {
        this.plc(1);
      }
      if (this.$store.state.global.PLC2State) {
        this.plc(2);
      }
    },
    watch: {
      PLCState1(nval) {
        if (nval) {
          this.plc(1);
        }
      },
      PLCState2(nval) {
        if (nval) {
          this.plc(2);
        }
      },
    },
    methods: {
      plc(id) {
        this[`$plc${id}`].readRegisters16(4596, 6, (data) => {
          const datas = returnData16(data);
          this[`plc${id}`] = {
            ceiling: this.$UC.plc2mpa(datas[0]), // 上限
            differencePressure: this.$UC.plc2mpa(datas[1]), // 下限
            superSetPressure: this.$UC.plc2mpa(datas[2]), // 超设置压力
            returnPressure: this.$UC.plc2mpa(datas[3]), // 回程压力
            delay: this.$UC.ms2s(datas[4]), // 油泵延时s
            replenish: datas[5], // 补压压力%
          };
          console.log(`PLC${id}返回读取16位寄存器：`, datas);
        });
      },
      plcSave(id) {
        const data = this[`plc${id}`];
        const datas = [
          this.$UC.mpa2plc(data.ceiling),
          this.$UC.mpa2plc(data.differencePressure),
          this.$UC.mpa2plc(data.superSetPressure),
          this.$UC.mpa2plc(data.returnPressure),
          this.$UC.s2ms(data.delay),
          parseInt(data.replenish, 10),
        ];
        console.log(data, datas);
        this[`$plc${id}`].writeMultipleRegisters16(4596, datas, (data) => {
          console.log(data);
          this.$message.success(`plc${id}写入成功`, data);
          this.plc(id);
        });
      },
      getSys() {
        this.sensor = window.systemDB.getOne({ name: 'sensor' });
        this.control = window.systemDB.getOne({ name: 'control' });
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
