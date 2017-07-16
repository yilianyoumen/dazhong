// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import tool from "./tool.js"
import vueRource from "vue-resource"
Vue.use(tool)
Vue.use(vueRource)
require("./assets/css/common.css")
require("./assets/css/reset.css")
require("./assets/css/animate.css")
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
console.log(Vue.prototype)