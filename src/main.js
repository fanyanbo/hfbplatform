import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont.css'
import phonefilter from './components/phonefilter';

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.component('phonefilter', phonefilter);    // 注册自定义组件 phonefilter

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
