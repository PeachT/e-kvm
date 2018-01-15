<template>
  <div class="wh100 manual">
    <div class="operation">
      <el-input size="medium">
        <i slot="suffix" class="el-input__icon el-icon-news"></i>
        <template slot="prepend">泵顶组</template>
      </el-input>
      <div class="el-checkbox-group" >
        <el-checkbox :label="true" border>强制运行</el-checkbox>
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
            <el-input size="medium" v-model="ab[item].setMap">
              <template slot="prepend">设置压力</template>
              <template slot="append">Mpa</template>
            </el-input>
            <el-input size="medium" :value="ab[item].map" disabled>
              <template slot="prepend">当前压力</template>
              <template slot="append">Mpa</template>
            </el-input>
            <el-input size="medium" v-model="ab[item].setMM">
              <template slot="prepend">设置位移</template>
              <template slot="append">mm&nbsp;</template>
            </el-input>
            <el-input size="medium" :value="ab[item].mm" disabled>
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
            <el-input size="medium" v-model="ab[item].setMap">
              <template slot="prepend">设置压力</template>
              <template slot="append">Mpa</template>
            </el-input>
            <el-input size="medium" :value="ab[item].map" disabled>
              <template slot="prepend">当前压力</template>
              <template slot="append">Mpa</template>
            </el-input>
            <el-input size="medium" v-model="ab[item].setMM">
              <template slot="prepend">设置位移</template>
              <template slot="append">mm&nbsp;</template>
            </el-input>
            <el-input size="medium" :value="ab[item].mm" disabled>
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
  </div>
</template>

<script>
  export default {
    name: 'manual',
    data() {
      return {
        device: null,
        // patternStr: ['A1', 'A2', 'B1', 'B2'],
        shows: ['A1', 'A2', 'B1', 'B2'],
        ab: {
          A1: {
            map: null,
            mm: null,
            setMpa: null,
            setMM: null,
          },
          A2: {
            map: null,
            mm: null,
            setMpa: null,
            setMM: null,
          },
          B1: {
            map: null,
            mm: null,
            setMpa: null,
            setMM: null,
          },
          B2: {
            map: null,
            mm: null,
            setMpa: null,
            setMM: null,
          },
        },
      };
    },
    beforeMount() {
      this.device = window.deviceDB.getAll[0];
    },
    computed: {
      patternStr() {
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
      },
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
</style>
