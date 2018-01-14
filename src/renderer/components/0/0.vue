<template>
  <div id='demo3'>
    <h3>demo4</h3>
    <button @click="state = !state">点击</button>
    <asyncCom v-if="state"></asyncCom>
  </div>
</template>

<script>
  import loadingCom from './1.vue';
  import errCom from './2.vue';
  // 2.3 新增
  const asyncCom = () => ({
    component: new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import ('./3.vue'));
        // reject()
      }, 2000);
    }),
    loading: loadingCom,
    error: errCom,
    delay: 500,
    timeout: 3000,
  });
  export default {
    name: 'demo4',
    data() {
      return {
        state: false,
      };
    },
    components: {
      asyncCom,
    },
  };

</script>

<style scoped>


</style>

