import Vue from 'vue';
import Router from 'vue-router';

const Home = require('@/components/home').default;

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: Home,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
