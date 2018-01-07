import Vue from 'vue';
import ElementUI from 'element-ui';
import * as D3 from 'd3';
import 'element-ui/lib/theme-chalk/index.css';
import {} from './js/iconfont.js';
// import axios from 'axios';
import App from './App';
import router from './router';
import store from './store';

import Db from './db/db';
import Unity from './js/unity';
import Modbus from './modbus-tcp/index';
import UnitConversion from './objJS/unitConversion';
import ObjUnity from './objJS/objUnity';

const plc1 = new Modbus('192.168.181.101');
const plc2 = new Modbus('192.168.181.102');

Vue.prototype.$db = Db;
Vue.prototype.$d3 = D3;
Vue.prototype.$unity = Unity;
Vue.prototype.$UC = UnitConversion;
Vue.prototype.$Ounity = ObjUnity;
Vue.prototype.$plc1 = plc1;
Vue.prototype.$plc2 = plc2;

Vue.use(ElementUI, {
  size: 'small',
});
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
// Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

// Symbol方式引用iconfont


// 全局过滤注册
Vue.filter('imgPath', (val, vv) => {
  console.log(val, vv);
  return val;
});
Vue.filter('plc2mpa', (val, vv) => {
  console.log('123312123', val, vv);
  return UnitConversion.plc2mpa(val);
});
Vue.filter('plc2mm', (val, vv) => {
  console.log('123312123', val, vv);
  return UnitConversion.plc2mm(val);
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
