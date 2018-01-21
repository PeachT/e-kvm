<template>
  <div class="wh100 manual"
    v-loading="dataState"
    element-loading-text="没有可用的设备"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="operation" v-show="!dab">
      <el-input size="medium"  @click.native="deviceState = true" :value="deviceName">
        <i slot="suffix" class="el-input__icon el-icon-news"></i>
        <template slot="prepend">泵顶组</template>
      </el-input>
      <div class="el-checkbox-group" >
        <el-checkbox :label="true" v-model="ensorce" border @change="ensorceFunc()">强制运行</el-checkbox>
      </div>
      <el-checkbox-group v-model="shows">
        <el-checkbox :label="item" v-for="(item, index) in patternStr.AB" :key="index" border></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="gloups" >
      <div class="gloup" v-if="patternStr.A.length > 0" v-show="shows.indexOf('A1') > -1 || shows.indexOf('A2') > -1">
        <div class="item" v-for="(item, index) in patternStr.A" :key="index" v-show="shows.indexOf(item) > -1">
          <div class="i">
            <div class="title">{{item}}</div>
            <el-input size="medium"
              @focus="$unity.focusAllVal($event)"
              v-model.number="ab[item].setMpa"
              type="number" @change="writeMpa(item)">
              <template slot="prepend">设置压力</template>
              <template slot="append" >Mpa</template>
            </el-input>
            <el-input size="medium" :value="currentlyData[`${item}mpa`] | plc2mpa(item, deviceId)" disabled>
              <template slot="prepend">当前压力</template>
              <template slot="append">Mpa</template>
            </el-input>
            <el-input size="medium" @focus="$unity.focusAllVal($event)" v-model.number="ab[item].setMM" type="number" @change="writeMM(item)">
              <template slot="prepend">设置位移</template>
              <template slot="append">mm&nbsp;</template>
            </el-input>
            <el-input size="medium" :value="currentlyData[`${item}mm`] | plc2mm(item, deviceId)" disabled>
              <template slot="prepend">当前位移</template>
              <template slot="append">mm&nbsp;</template>
            </el-input>
            <!-- <el-input size="medium">
              <template slot="prepend">速度s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</template>
              <template slot="append">mm&nbsp;</template>
            </el-input> -->
          </div>
        </div>
      </div>
      <div class="gloup" v-if="patternStr.B.length > 0" v-show="shows.indexOf('B1') > -1 || shows.indexOf('B2') > -1">
        <div class="item" v-for="(item, index) in patternStr.B" :key="index" v-show="shows.indexOf(item) > -1">
          <div class="i">
            <div class="title">{{item}}</div>
            <el-input size="medium" @focus="$unity.focusAllVal($event)" v-model.number="ab[item].setMpa" type="number" @change="writeMpa(item)" >
              <template slot="prepend">设置压力</template>
              <template slot="append">Mpa</template>
            </el-input>
            <el-input size="medium" :value="currentlyData[`${item}mpa`] | plc2mpa(item, deviceId)" disabled>
              <template slot="prepend">当前压力</template>
              <template slot="append">Mpa</template>
            </el-input>
            <el-input size="medium" @focus="$unity.focusAllVal($event)" v-model.number="ab[item].setMM" type="number" @change="writeMM(item)">
              <template slot="prepend">设置位移</template>
              <template slot="append">mm&nbsp;</template>
            </el-input>
            <el-input size="medium" :value="currentlyData[`${item}mm`] | plc2mm(item, deviceId)" disabled>
              <template slot="prepend">当前位移</template>
              <template slot="append">mm&nbsp;</template>
            </el-input>
            <!-- <el-input size="medium">
              <template slot="prepend">速度s&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</template>
              <template slot="append">mm&nbsp;</template>
            </el-input> -->
          </div>
        </div>
      </div>
    </div>
    <div v-if="deviceState">
      <device-select :show.sync="deviceState" :deviceId.sync="deviceId" />
    </div>
  </div>
</template>

<script>
  import DeviceSelect from './deviceSelect.vue';
  const { ipcRenderer } = require('electron');

  export default {
    name: 'manual',
    props: ['dId', 'dab'],
    components: {
      DeviceSelect,
    },
    data() {
      return {
        device: null,
        deviceId: null,
        deviceName: null,
        deviceState: false,
        dataState: false,
        ensorce: false,
        // patternStr: ['A1', 'A2', 'B1', 'B2'],
        shows: ['A1', 'A2', 'B1', 'B2'],
        ab: {
          A1: {
            setMpa: 0,
            setMM: 0,
          },
          A2: {
            setMpa: 0,
            setMM: 0,
          },
          B1: {
            setMpa: 0,
            setMM: 0,
          },
          B2: {
            setMpa: 0,
            setMM: 0,
          },
        },
        sensor: {
          displacement: null, // 位移传感器
          displacementPLC: null,
          pressure: null, // 压力传感器
          pressurePLC: null,
          toFixed: null,
        },
      };
    },
    beforeMount() {
      let s = null;
      if (this.dab) {
        s = this.dId;
        this.shows = [this.dab];
      } else {
        s = window.manual.getAll[0];
      }
      this.sensor = window.systemDB.getOne({ name: 'sensor' });
      if (this.$store.state.global.PLC1State) {
        ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2058, data: true });
      }
      if (this.$store.state.global.PLC2State) {
        ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2058, data: true });
      }
      if (s.id) {
        this.device = window.deviceDB.getOne({ id: s.id });
      } if (window.deviceDB.getAll[0]) {
        this.device = window.deviceDB.getAll[0];
      }
      this.deviceName = this.device.name;
      this.deviceId = this.device.id;
    },
    computed: {
      patternStr() {
        if (this.device) {
          const p = this.device.tensioningPattern.sort();
          if (p.indexOf(4) !== -1) {
            return {
              AB: ['A1', 'A2', 'B1', 'B2'],
              A: ['A1', 'A2'],
              B: ['B1', 'B2'],
            };
          }
          const ps = {
            AB: [],
            A: [],
            B: [],
          };
          p.map((item) => {
            ps.AB.push(item);
            switch (item) {
              case 0:
                ps.A.push('A1');
                break;
              case 1:
                ps.A.push('A2');
                break;
              case 2:
                ps.B.push('B1');
                break;
              case 3:
                ps.B.push('B2');
                break;
              default:
                break;
            }
            return null;
          });
          return ps;
        }
        this.dataState = true;
        return {
          AB: ['A1', 'A2', 'B1', 'B2'],
          A: ['A1', 'A2'],
          B: ['B1', 'B2'],
        };
      },
      currentlyData() {
        const p1 = this.$store.state.global.PLC1Data;
        const p2 = this.$store.state.global.PLC2Data;
        return {
          A1mpa: p1.A1mpa,
          A1mm: p1.A1mm,
          B1mpa: p1.B1mpa,
          B1mm: p1.B1mm,
          A2mpa: p2.A2mpa,
          A2mm: p2.A2mm,
          B2mpa: p2.B2mpa,
          B2mm: p2.B2mm,
        };
      },
      diviceId(nval) {
        window.deviceId = nval;
      },
    },
    methods: {
      // 强制运行
      ensorceFunc() {
        ipcRenderer.send('wPLC1', { func: 'writeSingleCoil', address: 2059, data: this.ensorce });
        ipcRenderer.send('wPLC2', { func: 'writeSingleCoil', address: 2059, data: this.ensorce });
      },
      writeMpa(item) {
        let address = 0;
        switch (item) {
          case 'A1':
            address = 4106;
            break;
          case 'A2':
            address = 4106;
            break;
          case 'B1':
            address = 4108;
            break;
          case 'B2':
            address = 4108;
            break;
          default:
            break;
        }
        let setMpa = this.ab[item].setMpa;
        setMpa = setMpa > this.sensor.pressurePLC ? this.sensor.pressure : setMpa;
        setMpa = setMpa < 0 ? 0 : setMpa;
        this.ab[item].setMpa = setMpa;
        const mpa = this.$UC.mpa2plc(setMpa);
        const func = (item === 'A1' || item === 'B1') ? 'wPLC1' : 'wPLC2';
        ipcRenderer.send(func, { func: 'writeMultipleRegisters16', address: address, data: [mpa] });
      },
      writeMM(item) {
        let address = 0;
        switch (item) {
          case 'A1':
            address = 4107;
            break;
          case 'A2':
            address = 4107;
            break;
          case 'B1':
            address = 4109;
            break;
          case 'B2':
            address = 4109;
            break;
          default:
            break;
        }
        let setMM = this.ab[item].setMM;
        setMM = setMM > this.sensor.displacementPLC ? this.sensor.displacement : setMM;
        setMM = setMM < 0 ? 0 : setMM;
        this.ab[item].setMM = setMM;
        const mm = this.$UC.mm2plc(setMM);
        const func = (item === 'A1' || item === 'B1') ? 'wPLC1' : 'wPLC2';
        ipcRenderer.send(func, { func: 'writeMultipleRegisters16', address: address, data: [mm] });
      },
    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      const s = window.manual.getAll[0];
      s.id = this.deviceId;
      window.manual.update(s);
      if (this.$store.state.global.PLC1State) {
        ipcRenderer.send('wPLC1', { func: 'writeMultipleCoil', address: 2058, data: [0, 0] });
        ipcRenderer.send('wPLC1', { func: 'writeMultipleRegisters16', address: 4106, data: [0, 0, 0, 0] });
      }
      if (this.$store.state.global.PLC2State) {
        ipcRenderer.send('wPLC2', { func: 'writeMultipleCoil', address: 2058, data: [0, 0] });
        ipcRenderer.send('wPLC2', { func: 'writeMultipleRegisters16', address: 4106, data: [0, 0, 0, 0] });
      }
      next();
    },
  };
</script>


<style lang="scss" scoped>
$border-color: #ccc;

.manual{
  display: flex;
  flex-direction: column;
  .operation{
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $border-color;
    div{
      width: auto;
    }
  }
  .gloups{
    display: flex;
    flex-direction: column;
    flex: 1;
    .gloup{
      height: 100%;
      width: 100%;
      display: flex;
      .item{
        flex: 1;
        border: 1px solid $border-color;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .i{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          display: flex;
          width: 80%;
          .title{
            font-size: 64px;
          }
          div{
            margin-bottom: 15px;
          }
        }
      }
    }
  }
}
.deviceSet{
  display: flex;
}
.w100{
  width: 100%;
}
</style>
