<template>
  <div class="wh100">
    <!--  -->
    <el-form class="form-info" label-width="90px">
      <div class="text-info">
        <div class="row-flex">
          <el-form-item label="构件/孔号">
            <div class="row-flex" @click="structureSelectState = editState">
              <el-input v-model="structure.name" >
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
              <el-input v-model="structure.holeName">
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="设 备">
            <div class="row-flex" @click="deviceState = editState">
              <el-input v-model="deviceName">
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
              <el-button :disabled="manualGroupState" @click="manualGroup()">分组</el-button>
            </div>
          </el-form-item>
        </div>
        <div class="row-flex">
          <el-form-item label="梁 号">
            <el-input @focus="$unity.focusAllVal($event)" :value="bridgeName" @change="$emit('update:bridgeName', $event)"></el-input>
          </el-form-item>
          <el-form-item label="钢绞线">
            <div class="row-flex" @click="steelStrandState = editState">
              <el-input @focus="$unity.focusAllVal($event)" v-model="steelStrand">
                <i slot="suffix" class="el-input__icon el-icon-news"></i>
              </el-input>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="img-info">
        <img src="" alt="没有图片">
      </div>
    </el-form>
    <div v-if="structureSelectState">
      <structure-select :show.sync="structureSelectState" @holeDataFunc="holeDataFunc"></structure-select>
    </div>
    <div v-if="steelStrandState">
      <steel-strand-select :show.sync="steelStrandState" @steelStrandDataFunc="steelStrandDataFunc"></steel-strand-select>
    </div>
    <div v-if="deviceState">
      <device-select :show.sync="deviceState" @deviceDataFunc="deviceDataFunc"></device-select>
    </div>
  </div>
</template>

<script>
  import StructureSelect from './baseTop/structureSelect.vue';
  import SteelStrandSelect from './baseTop/steelStrandSelect.vue';
  import DeviceSelect from './baseTop/deviceSelect.vue';

  // 张拉组数据
  const group = {
    name: null, // 用 ‘/’ 号隔开A，B组张拉孔号 只有一个孔时不要‘/’号
    state: 0, // 张拉状态 0未张拉 1已张拉
    tensioningKN: 0, // 张拉控制应力
    steelStrandNumber: 0, // 钢绞线数量
    length: 0, // 张拉长度
    tensioningPattern: 0, // 0~4 依次 A1单顶 A两顶 B1单顶 B两顶 四顶
    stage: 1, // 张拉段数
    two: false, // 二次张拉
    exceed: false, // 超张拉
    task: { // 任务数据
      stage: [10, 20, 50, 100], // 张拉阶段
      time: [30, 30, 30, 30], // 持荷时间
    },
  };
  const ab = {
    LQ: 4,
    NS: 6,
    LL: 0,
  };
  const ab2 = {
    LQ: 4,
    NS: 6,
  };
  export default {
    name: 'main',
    components: {
      StructureSelect,
      SteelStrandSelect,
      DeviceSelect,
    },
    props: [
      'holeId',
      'structureId',
      'deviceId',
      'bridgeName',
      'steelStrandId',
      'data',
      'editState',
    ],
    data: () => ({
      structureSelectState: false,
      structure: {
        name: '',
        holeName: '',
      },
      deviceState: false,
      deviceName: '',
      steelStrandState: false,
      steelStrand: '',
      group: {
        tensioningPattern: null,
        holeDetail: null,
      },
    }),
    computed: {
      manualGroupState() {
        const d = this.deviceName ? 1 : 0;
        const s = this.structure.name ? 1 : 0;
        console.log(d, s, this.editState && d && s);
        return !(this.editState && d && s);
      },
    },
    beforeMount() {
      this.holeDataFunc(this.holeId);
      this.deviceDataFunc(this.deviceId);
      this.steelStrandDataFunc(this.steelStrandId);
    },
    watch: {
      holeId() {
        this.holeDataFunc(this.holeId);
      },
      deviceId() {
        this.deviceDataFunc(this.deviceId);
      },
      steelStrandId() {
        this.steelStrandDataFunc(this.steelStrandId);
      },
    },
    methods: {
      holeDataFunc(id = null) {
        try {
          if (id) {
            const structureData = window.girderDB.getOne({ 'holes.id': id });
            const holes = structureData.holes.filter(item => item.id === id)[0];
            this.structure.name = structureData.name;
            this.structure.holeName = holes.name;
            this.group.holeDetail = holes.detail;
            this.$emit('update:holeId', id);
            this.$emit('update:structureId', structureData.id);
            this.groupFunc();
          } else {
            this.structure.name = null;
            this.structure.holeName = null;
            this.group.holeDetail = null;
          }
        } catch (error) {}
      },
      deviceDataFunc(id = null, tensioningPattern = null) {
        try {
          if (id) {
            this.deviceName = window.deviceDB.getOne({ id: id }).name;
            this.group.tensioningPattern = tensioningPattern;
            this.$emit('update:deviceId', id);
            this.groupFunc();
          }
        } catch (error) {}
      },
      steelStrandDataFunc(id = null) {
        try {
          if (id) {
            const steelStrand = window.steelStrandsDB.getOne({ id: id });
            this.steelStrand = steelStrand.specs;
            this.$emit('update:steelStrandId', id);
          }
        } catch (error) {}
      },
      groupFunc() {
        const group = this.group;
        if (group.holeDetail && group.tensioningPattern !== null) {
          const groups = [];
          const holeArr = group.holeDetail.split(',');
          const skip = group.tensioningPattern === 4 ? 2 : 1;
          for (let index = 0; index < holeArr.length;) {
            if (group.tensioningPattern === 4) {
              if (holeArr.length > 1) {
                groups.push({ hole: holeArr.splice(0, skip), tensioningPattern: 4 });
              } else {
                groups.push({ hole: holeArr.splice(0, skip), tensioningPattern: 1 });
              }
            } else {
              groups.push(
                { hole: holeArr.splice(0, skip), tensioningPattern: group.tensioningPattern });
            }
          }
          this.groupData(groups);
        }
      },
      groupData(data) {
        const groups = [];
        data.forEach((item) => {
          const d = this.$unity.copyObj(group);
          d.name = item.hole.length === 2 ? `${item.hole[0]}/${item.hole[1]}` : item.hole[0];
          d.tensioningPattern = item.tensioningPattern;
          switch (item.tensioningPattern) {
            case 0:
              d.task.A1 = ab;
              break;
            case 1:
              d.task.A1 = ab;
              d.task.A2 = ab2;
              break;
            case 2:
              d.task.B1 = ab;
              break;
            case 3:
              d.task.B1 = ab;
              d.task.B2 = ab2;
              break;
            case 4:
              d.task.A1 = this.$unity.copyObj(ab);
              d.task.A2 = this.$unity.copyObj(ab2);
              d.task.B1 = this.$unity.copyObj(ab);
              d.task.B2 = this.$unity.copyObj(ab2);
              break;
            default:
              break;
          }
          groups.push(d);
        });
        this.$emit('update:data', groups);
      },
      manualGroup() {
        console.log('手动分组');
      },
    },
  };

</script>

<style lang="scss">
.form-info{
  display: flex;
  .text-info{
    flex: auto;
  }
  .img-info{
    width: 210px;
    margin: 0 15px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
