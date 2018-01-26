<template>
  <div>

  <el-dialog
    title="报警"
    :visible="errorState"
    fullscreen
    :before-close="handleClose">
    <div>
      <el-checkbox-group
        v-model="showAB"
        :min="1"
        :max="4">
        <el-checkbox v-for="(item, index) in ['A1', 'A2', 'B1', 'B2']" :label="item" :key="index">{{item}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="error">
      <div class="item" v-for="ab in showAB" :key="ab">
        <h1>{{ab}}</h1>
        <el-alert
          v-for="(item, index) in errorStr"
          :key="index"
          v-show="currentlyS[ab][index] == 1"
          :title="item[0]"
          type="error"
          :description="item[1]"
          :closable="false"
          show-icon>
        </el-alert>
      </div>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'error',
  props: ['errorState'],
  data() {
    return {
      errorStr: [
        ['超系统压力上限！', ''],
        ['超设置设置压力', ''],
        ['超系统位移上限！', ''],
        ['超系统位移下限', ''],
        ['位移未连接', ''],
        ['压力未连接', ''],
      ],
      showAB: ['A1', 'A2', 'B1', 'B2'],
    };
  },
  computed: {
    PLCState1() {
      return this.$store.state.global.PLC1State;
    },
    PLCState2() {
      return this.$store.state.global.PLC2State;
    },
    currentlyS() {
      const r = {
        A1: [],
        A2: [],
        B1: [],
        B2: [],
      };
      const p1 = this.$store.state.global.PLC1S;
      const p2 = this.$store.state.global.PLC2S;
      if (this.PLCState1) {
        r.A1 = p1.slice(0, 20);
        r.A2 = p1.slice(20, 40);
      }
      if (this.PLCState2) {
        r.B1 = p2.slice(0, 20);
        r.B2 = p2.slice(20, 40);
      }
      return r;
    },
  },
  beforeMount() {
    const device = window.deviceDB.getOne({ id: window.deviceId });
    if (device) {
      this.showAB = this.$Ounity.devicePattern(device.tensioningPattern);
    }
  },
  methods: {
    handleClose(done) {
      this.$emit('update:errorState', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.error{
  display: flex;
  .item{
    flex: 1;

  }
}
</style>

