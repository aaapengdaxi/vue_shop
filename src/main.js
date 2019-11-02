//入口文件 entry
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 导航守卫是为了防止非法访问
//axios拦截器 是为了复用代码, 把每个ajax都要设置的头信息提取到拦截器当中
//axios请求拦截器
axios.interceptors.request.use(function(config){
  //为请求头对象 添加token
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 返回 config
  return config;
})
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
