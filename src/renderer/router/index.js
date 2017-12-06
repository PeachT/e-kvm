import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';

import Root from '../components/root.vue';
import store from '../store/index';

const Login = require('@/components/login').default;
const Menu = require('@/components/menus/menu').default;
const Task = require('@/components/task/task').default;
const Record = require('../components/record/record.vue').default;
const User = require('@/components/user/user.vue').default;
const Device = require('@/components/device/device.vue').default;
const Girder = require('@/components/girder/girder.vue').default;
const Monitoring = require('../components/monitoring/monitoring.vue').default;

Vue.use(Router);
Vue.use(Vuex);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/monitoring',
    name: 'monitoring',
    component: Monitoring,
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
    path: '/record',
    name: 'record',
    component: Root,
    children: [
      { path: '', component: Record, name: '记录' },
    ],
  },
  {
    path: '/user',
    name: 'task',
    component: Root,
    children: [
      { path: '', component: User, name: '用户' },
    ],
  },
  {
    path: '/device',
    name: 'device',
    component: Root,
    children: [
      { path: '', component: Device, name: '设备' },
    ],
  },
  {
    path: '/girder',
    name: 'girder',
    component: Root,
    children: [
      { path: '', component: Girder, name: '构件' },
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
