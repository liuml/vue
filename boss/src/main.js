// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Croppa from 'vue-croppa'
import router from './router'
import store from './store'
import adapt from './assets/js/adapt'
import setLoginUserInfo from './assets/js/setUser'
import './assets/js/axios'
import './assets/js/mintuiComponents'
import './assets/js/filters'
import './assets/less/main.less'
import 'vue-croppa/dist/vue-croppa.css'
Vue.config.productionTip = false
adapt(375, 100)
// 供Android和IOS调用设置用户的信息
window.setLoginUserInfo = setLoginUserInfo
Vue.use(Croppa)
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  data: {
    imgBaseurl: 'http://oss.bossapp.cn/',
    baseConfig: {},
    isWeixin: false,
    isAndroid: navigator.userAgent.includes('BossShangeXue-Android'),
    isIOS: navigator.userAgent.includes('BossShangeXue-iOS')
  },
  mounted () {
    this.getBaseConfig()
    this.isWeiXin()
    if (this.isAndroid) {
      window.BossAndroid.syncLoginUserInfo()
    }
    if (this.isIOS) {
      window.webkit.messageHandlers.syncLoginUserInfo.postMessage({})
    }
  },
  methods: {
    getBaseConfig () {
      this.axios.get(`public/baseConfig.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.baseConfig = JSON.parse(result.data)
          }
        })
    },
    isWeiXin () {
      // 判断是否在微信浏览器中
      let ua = navigator.userAgent.toLowerCase()
      let result = ua.match(/MicroMessenger/i)
      if (result && result[0] === 'micromessenger') {
        this.isWeixin = true
      } else {
        this.isWeixin = false
      }
    },
    downloadApp (message) {
      this.messageBox.confirm(message).then(action => {
        if (action === 'confirm') {
          window.location.href = 'http://www.baidu.com/'
        }
      }, cancel => {})
    },
    bannerClick (banner) {
      switch (banner.type) {
        case 2:
          // 商学院详情
          if (this.$root.isAndroid) {
            window.BossAndroid.bsxOpenSch(banner.typeId)
          } else if (this.$root.isIOS) {
            window.webkit.messageHandlers.bsxOpenSch.postMessage({id: banner.typeId})
          } else {
            this.$router.push(`/courseDetail/${banner.typeId}`)
          }
          break
        case 4:
          // 微课详情
          if (this.$root.isAndroid) {
            window.BossAndroid.bsxOpenMic(banner.typeId)
          } else if (this.$root.isIOS) {
            window.webkit.messageHandlers.bsxOpenMic.postMessage({id: banner.typeId})
          } else {
            this.$router.push(`/microCourseDetail/${banner.typeId}`)
          }
          break
        case 7:
          // 链接跳转
          if (this.$root.isAndroid) {
            window.BossAndroid.bsxOpenUrl(banner.href)
          } else if (this.$root.isIOS) {
            window.webkit.messageHandlers.bsxOpenUrl.postMessage({url: banner.href})
          } else {
            window.location.assign(banner.href)
          }
          break
      }
    },
    toLink (key) {
      window.location.assign(this.baseConfig[key])
    }
  },
  template: '<App/>'
})
