<template>
  <div class="wh100">
    <h1>{{title}}--{{msg}}</h1>
    <ve-line
      :data="chartData"
      :settings="chartSettings"
      :tooltip-visible="false"
      :colors="colors"
    ></ve-line>
      <!-- :events="chartEvents" -->
      <!-- :legend-visible="false" -->
  </div>
</template>

<script>
  import VeLine from 'v-charts/lib/line';
  // Request('v-charts/lib/echarts');
  // Request('../../../../../node_modules/echarts/dist/echarts');
  // import {} from '../../../../../node_modules/echarts/dist/echarts';
  export default {
    name: 'vuline',
    props: ['title', 'max'],
    components: {
      VeLine,
    },
    computed: {
      chartData() {
        const r = this.add();
        return {
          columns: ['date', 'A1', 'A2', 'B1', 'B2'],
          rows: r,
        };
      },
    },
    data: () => ({
      msg: '',
      // chartData: {
      //   columns: ['date', 'A1', 'A2', 'B1', 'B2'],
      //   rows: [{
      //     date: 1,
      //     A1: 55,
      //     A2: 55,
      //     B1: 55,
      //     B2: 55,
      //   }],
      // },
      chartSettings: {
        metrics: ['A1', 'A2', 'B1', 'B2'],
        dimension: ['date'],
      },
      colors: ['#ff3333', '#ff33cc', '#00cc33', '#00cccc'],
    }),
    methods: {
      add() {
        const rows = [];
        for (let index = 0; index < 50; index += 1) {
          rows.push({
            date: index,
            A1: Math.ceil(Math.random() * this.max),
            A2: Math.ceil(Math.random() * this.max),
            B1: Math.ceil(Math.random() * this.max),
            B2: Math.ceil(Math.random() * this.max),
          });
        }
        return rows;
      },
    },
  };

</script>
