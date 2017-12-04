import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';

import Root from '../components/root.vue';
import store from '../store/index';

const Home = require('@/components/home').default;
const Menu = require('@/components/menus/menu').default;
const Task = require('@/components/task/task').default;

Vue.use(Router);
Vue.use(Vuex);

const routes = [
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
    path: '/task',
    name: 'task',
    component: Root,
    children: [
      { path: '', component: Task, name: '任务' },
    ],
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new Router({
  // mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  store.commit('showMenu', false);
  store.commit('menuTitle', to.name);
  // console.log(to.name);
  next();
});

export default router;
