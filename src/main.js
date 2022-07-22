import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入icon图标
import '@/assets/fonts/iconfont.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import '@/assets/css/news.css'

Vue.config.productionTip = false

Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
