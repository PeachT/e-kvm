<template>
  <div>
    <h3>压力曲线</h3>
    <div class="svg">
      <svg name="svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="400" version='1.1' viewbox="viewBoxSize" preserveAspectRatio="none">
        <!-- <line x1="0" y1="0" x2="300" y2="300"style="stroke:rgb(99,99,99);stroke-width:2"/> -->
        <g transform="translate(0,0)">
          <g transform="translate(25,350)" style="opacity: 1;">
            <line x2="2000" y2="0"></line>
            <text y="0" x="-5" dy=".32em" style="text-anchor: end;">0</text>
          </g>
          <g class="tick" transform="translate(50,370)" style="opacity: 1;">
            <line x2="0" y2="-400"></line>
            <text x="0" y="9" dy=".71em" style="text-anchor: middle;">0</text>
          </g>
          <g transform="translate(0,0)">
            <polyline v-for="(item, index) in svgData.points" :points="item" :style="{stroke:data.color[index]}" :key="index" />
          </g>
        </g >
      </svg>
    </div>
    <button @click="add">++</button>
    <button @click="clear">--</button>
    <input type="number" v-model="sk">
    <h1 hidden="hidden">{{svgData}}</h1>
  </div>
</template>

<script>
  export default {
    name: 'sbg',
    mounted() {
      this.svg = document.getElementsByName('svg')[0];
    },
    computed: {
      svgData() {
        // this.add();
        const svg = this.svg;
        console.log(svg);
        try {
          const narr = [
            [],
            [],
            [],
            [],
          ];
          let xmax = 0;
          let ymax = 0;
          const xb = svg.scrollWidth / (this.sk - 1);
          console.log(svg.scrollHeight, xb);
          this.data.points.map((value, index) => {
            value.slice(-1 * this.sk).map((val, ind) => {
              const x = ind * xb;
              if (xmax < x) {
                xmax = x;
              }
              if (ymax < val) {
                ymax = val;
              }
              narr[index].push(`${x + 50},${val}`);
              return null;
            });
            return null;
          });
          // console.log(narr[0])
          // let ski = narr[0].length > 60 ? narr[0].length - this.sk : 0
          // const points = narr.map((value, index) => value.join(' '));
          // console.log(new Date())
          return {
            points: narr.map((value, index) => value.join(' ')),
            viewBoxSize: `0 0 ${xmax} ${ymax}`,
          };
        } catch (error) {
          console.log(error);
          return {
            points: [],
            viewBoxSize: '0 0 0 0',
          };
        }
      },
      viewBoxSize() {
        return '0 0 800 200';
      },
    },
    data: () => ({
      svg: '',
      sk: 60,
      data: {
        color: ['#FA5555', '#EB9E05', '#409EFF', '#67C23A'],
        points: [
          [],
          [],
          [],
          [],
        ],
      },
    }),
    methods: {
      onTap() {
        console.log('tap');
        this.$message('tap修改消息');
      },
      onSwipeLeft() {
        console.log('tap');
        this.$message('onSwipeLeft修改消息');
      },
      add() {
        const arr = [
          [],
          [],
          [],
          [],
        ];
        for (let index = 0; index < 36000; index += 1) {
          arr[0].push(Math.ceil(Math.random() * 350));
          arr[1].push(Math.ceil(Math.random() * 350));
          arr[2].push(Math.ceil(Math.random() * 350));
          arr[3].push(Math.ceil(Math.random() * 350));
        }
        this.data.points = arr;
      },
      clear() {
        window.clearTimeout(this.t);
      },
    },
  };

</script>

<style lang="scss" scoped>
  .svg {
    margin: 15px 15px;
    }
  svg {
    fill: none;
    stroke-width: 1px;
    line,text{
      stroke:rgb(99,99,99);
      stroke-width:2;
    }
    polyline{
      fill: none;
      stroke-width: 1px;
      stroke-linejoin: round;
    }
  }

</style>

