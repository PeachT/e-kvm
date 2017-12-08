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

Vue.prototype.$db = Db;
Vue.prototype.$d3 = D3;

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

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
