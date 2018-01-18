<template>
  <div>
    <el-form
      label-width="100px"
      v-loading="!PLCState1"
      element-loading-text="请连接设备获取参数"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="plcLoad"
      v-for="(item, index) in ['z', 'c']" :key="index">
      <h3 style="background-color: rgb(245, 247, 250);">{{item === 'z' ? '主站' : '从站'}}系统参数</h3>
      <div class="row-flex">
        <el-form-item label="压力上限">
          <el-input type="number" v-model="plc[item].ceilingMpa">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="允许压力偏差">
          <el-input type="number" v-model="plc[item].differencePressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="超设置压力">
          <el-input type="number" v-model="plc[item].superSetPressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="允许回程压力">
          <el-input type="number" v-model="plc[item].returnPressure">
            <i slot="suffix">Mpa</i>
          </el-input>
        </el-form-item>
        <el-form-item label="油泵延时">
          <el-input  type="number" v-model="plc[item].delay">
            <i slot="suffix">s</i>
          </el-input>
        </el-form-item>
      </div>
      <div class="row-flex">
        <el-form-item label="补压参数">
          <el-input  type="number" v-model="plc[item].replenish">
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
        <el-form-item label="位移上限">
          <el-input v-model="plc[item].ceilingMM"></el-input>
        </el-form-item>
        <el-form-item label="位移下限">
          <el-input v-model="plc[item].lowerMM"></el-input>
        </el-form-item>
        <el-form-item label="工作位移上限">
          <el-input v-model="plc[item].WorkCeilingMM"></el-input>
        </el-form-item>
        <el-form-item label="工作位移下限">
          <el-input v-model="plc[item].WorkLowerMM"></el-input>
        </el-form-item>
      </div>
      <div class="row-flex">
        <div>
          <el-button style="float: right;" type="">刷新</el-button>
          <el-button style="float: right;" type="" @click="plcSave(index +1)">保存</el-button>
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
  const { ipcRenderer } = require('electron');

  export default {
    name: 'System',
    data: () => ({
      plc: {
        z: {
          ceilingMpa: 0, // 上限
          differencePressure: 0, // 运行压力差
          superSetPressure: 0, // 超设置压力
          returnPressure: 0, // 回程压力
          delay: 0, // 油泵延时
          replenish: 0, // 补压压力
          ceilingMM: 0, // 位移上限
          lowerMM: 0, // 位移下限
          WorkCeilingMM: 0, // 位移工作上限
          WorkLowerMM: 0, // 位移工作下限
        },
        c: {
          ceilingMpa: 0, // 上限
          differencePressure: 0, // 运行压力差
          superSetPressure: 0, // 超设置压力
          returnPressure: 0, // 回程压力
          delay: 0, // 油泵延时
          replenish: 0, // 补压压力
          ceilingMM: 0, // 位移上限
          lowerMM: 0, // 位移下限
          WorkCeilingMM: 0, // 位移工作上限
          WorkLowerMM: 0, // 位移工作下限
        },
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
        this.plcFunc(1);
      }
      if (this.$store.state.global.PLC2State) {
        this.plcFunc(2);
      }
    },
    watch: {
      PLCState1(nval) {
        if (nval) {
          this.plcFunc(1);
        }
      },
      PLCState2(nval) {
        if (nval) {
          this.plcFunc(2);
        }
      },
    },
    methods: {
      plcFunc(id) {
        const func = id === 1 ? 'rPLC1' : 'rPLC2';
        ipcRenderer.send(func, { func: 'readRegisters16', address: 4596, data: 20, callback: 'systen' });
        ipcRenderer.on('systen', (event, data) => {
          const plc = data.id === 1 ? 'z' : 'c';
          const datas = returnData16(data.callbackData);
          this.plc[plc] = {
            ceilingMpa: this.$UC.plc2mpa(datas[0]), // 上限
            differencePressure: this.$UC.plc2mpa(datas[1]), // 下限
            superSetPressure: this.$UC.plc2mpa(datas[2]), // 超设置压力
            returnPressure: this.$UC.plc2mpa(datas[3]), // 回程压力
            delay: this.$UC.ms2s(datas[4]), // 油泵延时s
            replenish: datas[5], // 补压压力%
            ceilingMM: this.$UC.plc2mm(datas[10]), // 位移上限
            lowerMM: this.$UC.plc2mm(datas[11]), // 位移下限
            WorkCeilingMM: this.$UC.plc2mm(datas[12]), // 位移工作上限
            WorkLowerMM: this.$UC.plc2mm(datas[13]), // 位移工作下限
          };
        });
      },
      plcSave(id) {
        const func = id === 1 ? 'wPLC1' : 'wPLC2';
        const plc = id === 1 ? 'z' : 'c';
        const data = this.plc[plc];
        const datas = [
          this.$UC.mpa2plc(data.ceilingMpa),
          this.$UC.mpa2plc(data.differencePressure),
          this.$UC.mpa2plc(data.superSetPressure),
          this.$UC.mpa2plc(data.returnPressure),
          this.$UC.s2ms(data.delay),
          parseInt(data.replenish, 10),
          0,
          0,
          0,
          0,
          this.$UC.mm2plc(data.ceilingMM),
          this.$UC.mm2plc(data.lowerMM),
          this.$UC.mm2plc(data.WorkCeilingMM),
          this.$UC.mm2plc(data.WorkLowerMM),
        ];
        console.log(data, datas);
        ipcRenderer.send(func, { func: 'writeMultipleRegisters16', address: 4596, data: datas, callback: 'wSysten' });
        ipcRenderer.on('wSysten', (event) => {
          this.plcFunc(id);
          this.$message.success('PLC写入成功');
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
