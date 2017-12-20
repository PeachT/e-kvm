<template>
  <div ref="svg" class="svg" @click="show"
    v-loading="showState"
    element-loading-text="查看曲线"
    element-loading-spinner="el-icon-view"
    element-loading-background="rgba(0, 0, 0, 0.8)">
  </div>
</template>

<script>
export default {
  name: 'd3svg',
  props: ['data', 'refName'],
  data() {
    return {
      colors: ['#ff3333', '#ff33cc', '#00cc33', '#00cccc'],
      width: null,
      height: null,
      showState: true,
      // dataMax: null,
      a1: null,
      a2: null,
      b1: null,
      b2: null,
      x: null,
      y: null,
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    dataMax() {
      console.log('data变化了！！！');
      const data = this.data;
      const datas = data[0].concat(data[1]).concat(data[2]).concat(data[3]);
      return this.$d3.max(datas);
    },
  },
  watch: {
    data() {
      console.log('变化了！！！');
      this.showState = true;
    },
  },
  methods: {
    show() {
      if (this.showState) {
        this.initData();
      }
      this.showState = false;
    },
    async init() {
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
      this.a1 = svgg.append('path').style('stroke', this.colors[0]);
      this.a2 = svgg.append('path').style('stroke', this.colors[1]);
      this.b1 = svgg.append('path').style('stroke', this.colors[2]);
      this.b2 = svgg.append('path').style('stroke', this.colors[3]);
      this.x = svgg.append('g').attr('transform', `translate(0,${this.height})`);
      this.y = svgg.append('g');
    },
    initData() {
      const data = this.data;
      const sx = this.$d3.scaleLinear()
        .domain([0, data[0].length - 1])
        .range([0, this.width]);
      const sy = this.$d3.scaleLinear()
        .domain([0, this.dataMax])
        .range([this.height, 0]);
      const ll = this.$d3.line()
        .x((d, i) => sx(i))
        .y((d) => { return sy(d); })
        .curve(this.$d3.curveCardinal);
      const axisX = this.$d3.axisBottom(sx);
      const axisY = this.$d3.axisLeft(sy);

      this.a1.attr('d', ll(data[0]));
      this.a2.attr('d', ll(data[1]));
      this.b1.attr('d', ll(data[2]));
      this.b2.attr('d', ll(data[3]));
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

