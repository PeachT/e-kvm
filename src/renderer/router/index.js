import Vue from 'vue';
import Vuex from 'vuex';
import Router from 'vue-router';

import store from '../store/index';

const Root = () => import('../components/root.vue');
const Login = () => import('../components/login');
const Menu = () => import('../components/menus/menu');
const Task = () => import('../components/task/task');
const User = () => import('../components/user/user.vue');
const Device = () => import('../components/device/device.vue');
const Girder = () => import('../components/girder/girder.vue');
const Monitoring = () => import('../components/monitoring/monitoring.vue');
const Operator = () => import('../components/operator/operator.vue');
const SteelStrand = () => import('../components/steelStrand/steelStrand.vue');
const Tpl = () => import('../components/tpl/tpl.vue');
const System = () => import('../components/system/system.vue');
const Manual = () => import('../components/manual/manual.vue');
const D0 = () => import('../components/0/0.vue');

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
    path: '/d0',
    name: 'd0',
    component: Root,
    children: [
      { path: '', component: D0, name: 'dd' },
    ],
  },
  {
    path: '/manual',
    name: 'manual',
    component: Root,
    children: [
      { path: '', component: Manual, name: '手动' },
    ],
  },
  {
    path: '/task',
    name: 'task',
    component: Root,
    children: [
      { path: '', component: Task, name: '任务' },
      // { path: '/record', component: Task, name: '任务' },
    ],
  },
  {
    path: '/record',
    name: 'record',
    component: Root,
    children: [
      { path: '', component: Task, name: '记录' },
    ],
  },
  {
    path: '/user',
    name: 'user',
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
    path: '/system',
    name: 'system',
    component: Root,
    children: [
      { path: '', component: System, name: '系统' },
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
    path: '/operator',
    name: 'operator',
    component: Root,
    children: [
      { path: '', component: Operator, name: '操作员' },
    ],
  },
  {
    path: '/steelStrand',
    name: 'steelStrand',
    component: Root,
    children: [
      { path: '', component: SteelStrand, name: '钢绞线' },
    ],
  },
  {
    path: '/tpl',
    name: 'tpl',
    component: Root,
    children: [
      { path: '', component: Tpl, name: '模板' },
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
  console.log(store.state.global.operator);
  if (store.state.global.operator) {
    next();
  } else if (to.path !== '/') {
    next('/');
  } else {
    next();
  }
  // console.log(to.name);
});

export default router;
