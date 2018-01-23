<template>
  <div ref="svg" class="svg" @click="show"
  :style="{'height' : `${h}`}"
    v-loading="showState"
    element-loading-text="查看曲线"
    element-loading-spinner="el-icon-view"
    element-loading-background="rgba(0, 0, 0, 0.8)">
  </div>
</template>

<script>
export default {
  name: 'd3svg',
  props: ['data', 'time', 'tensioningPattern', 'refName', 'h'],
  data() {
    return {
      colors: {
        A1: '#ff3333',
        A2: '#ff33cc',
        B1: '#00cc33',
        B2: '#00cccc',
      },
      width: null,
      height: null,
      A1: null,
      A2: null,
      B1: null,
      B2: null,
      x: null,
      y: null,
      stageStr: null,
      showState: true,
      svg: null,
    };
  },
  mounted() {
    this.stageStr = this.$Ounity.abModel(this.tensioningPattern);
    this.init();
  },
  watch: {
    data() {
      this.showState = true;
    },
  },
  methods: {
    show() {
      if (this.showState) {
        this.stageStr = this.$Ounity.abModel(this.tensioningPattern);
        const svgMain = this.$refs.svg;
        const width = svgMain.clientWidth;
        const height = svgMain.clientHeight;
        this.width = width - 70;
        this.height = height - 70;
        this.svg.attr('width', width)
          .attr('height', height);
        this.initData();
      }
      this.showState = false;
    },
    // 创建画布
    init() {
      const svgMain = this.$refs.svg;
      const width = svgMain.clientWidth;
      const height = svgMain.clientHeight;
      this.width = width - 70;
      this.height = height - 70;
      const svg = this.$d3.select(svgMain)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      const svgg = svg.append('g')
        .attr('transform', 'translate(50,30)');
      this.stageStr.forEach((item) => {
        this[item] = svgg.append('path').style('stroke', this.colors[item]);
      });
      this.x = svgg.append('g').attr('transform', `translate(0,${this.height})`);
      this.y = svgg.append('g');
      this.svg = svg;
    },
    // 数据
    initData() {
      const datas = [];
      const d3 = this.$d3;
      const data = this.data;
      const d = {};
      const time = this.time;
      this.stageStr.forEach((item) => {
        datas.push(d3.max(data[`${item}${this.refName}`]));
        d[item] = data[`${item}${this.refName}`];
      });
      let max = 0;
      if (this.refName === 'Mpa') {
        max = this.$UC.plc2mpa(d3.max(datas));
      } else {
        max = this.$UC.plc2mm(d3.max(datas));
      }
      // X轴数据
      const sx = d3.scaleTime()
        .domain([new Date(time.start), new Date(time.end)])
        .range([0, this.width]);
      // 时间轴显示样式
      const axisX = d3.axisBottom(sx).tickFormat(d3.timeFormat('%H:%M:%S')).ticks(10);
      const sy = d3.scaleLinear()
        .domain([0, max]) // 单位换算
        .range([this.height, 0]);
      const axisY = d3.axisLeft(sy);
      // 曲线数据
      this.stageStr.forEach((item) => {
        const sxx = this.$d3.scaleLinear()
          .domain([0, d[item].length])
          .range([0, this.width]);
        if (this.refName === 'Mpa') {
          const ll = d3.line()
            .x((d, i) => sxx(i))
            .y((d) => { return sy(this.$UC.plc2mpa(d)); })
            .curve(d3.curveCatmullRom.alpha(0.9)); // 曲线样式
          this[item].attr('d', ll(d[item]));
        } else {
          const ll = d3.line()
            .x((d, i) => sxx(i))
            .y((d) => { return sy(this.$UC.plc2mm(d)); })
            .curve(d3.curveCatmullRom.alpha(0.9)); // 曲线样式
          this[item].attr('d', ll(d[item]));
        }
      });
      this.x.call(axisX);
      this.y.call(axisY);
    },
  },
};
</script>

<style lang="scss" >
.svg{
  // height: 500px;
  width: 100%;
  background-color: #E4E7ED;
  path{
    fill: none;
    stroke: blue;
    stroke-width: 2;
  }
  .el-loading-spinner{
    i, p{
      font-size: 48px;
    }
  }
}
</style>

