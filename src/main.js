//amfe-flexible: 手机适配效果
import 'amfe-flexible'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
//按需要导入组件
import './cube-ui'
//创建全局弹窗
import './create-api'
//导入样式 
import './common/stylus/index.styl'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
