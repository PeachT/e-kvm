import Vue from 'vue';
import Router from 'vue-router';

const Home = require('@/components/home').default;
const Menu = require('@/components/menus/menu').default;

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
