import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';

Vue.use(ElementUI, {
  size: 'small',
});
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
// Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

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
