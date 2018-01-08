<template>
  <div ref="svg" class="svg"
    v-loading="showState"
    element-loading-text="等待张拉..."
    element-loading-spinner="el-icon-view"
    element-loading-background="rgba(0, 0, 0, 0.8)">
  </div>
</template>

<script>
export default {
  name: 'd3svg',
  props: ['data', 'time', 'showState', 'stageStr'],
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
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    dataMax() {
      let datas = [];
      this.stageStr.forEach((item) => {
        datas = datas.concat(this.data[item]);
      });
      const max = this.$d3.max(datas);
      return max;
    },
  },
  watch: {
    data() {
      console.log('data变化了！！！', this.data);
      this.initData();
    },
  },
  methods: {
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
      // this.a1 = svgg.append('path').style('stroke', this.colors[0]);
      // this.a2 = svgg.append('path').style('stroke', this.colors[1]);
      // this.b1 = svgg.append('path').style('stroke', this.colors[2]);
      // this.b2 = svgg.append('path').style('stroke', this.colors[3]);
      this.x = svgg.append('g').attr('transform', `translate(0,${this.height})`);
      this.y = svgg.append('g');
    },
    // 数据
    initData() {
      const data = this.data;
      const time = this.time;
      const d3 = this.$d3;
      // X轴数据
      const sx = d3.scaleTime()
        .domain([new Date(time.start), new Date(time.end)])
        .range([0, this.width]);
      // 时间轴显示样式
      const axisX = d3.axisBottom(sx).tickFormat(d3.timeFormat('%H:%M:%S')).ticks(10);
      const sy = d3.scaleLinear()
        .domain([0, this.dataMax])
        .range([this.height, 0]);
      const axisY = d3.axisLeft(sy);
      // 曲线数据
      this.stageStr.forEach((item) => {
        const sxx = this.$d3.scaleLinear()
          .domain([0, data[item].length - 1])
          .range([0, this.width]);
        const ll = d3.line()
          .x((d, i) => sxx(i))
          .y((d) => { return sy(d); })
          .curve(d3.curveCatmullRom.alpha(0.5)); // 曲线样式
        this[item].attr('d', ll(data[item]));
      });
      this.x.call(axisX);
      this.y.call(axisY);
    },
  },
};
</script>

<style lang="scss" >
.svg{
  height: 500px;
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

