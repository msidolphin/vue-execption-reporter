import Vue from 'vue'
import App from './App'
import api from './api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueApiCreator from 'vue-api-creator'
import VueExceptionReporter from '../src'
import bus from './bus'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueApiCreator, {
  baseURL: '/api/v1',
  modules: api
})

Vue.use(VueExceptionReporter, {
  usingBeacon: false,
  reportUrl: 'http://localhost:7001/api/v1/exception/collect',
  afterReport () {
    bus.$emit('on-reported')
  },
  ignoreRepeatTimes: 5
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
