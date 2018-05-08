/**
 * Created by liuml on 2018/4/24.
 */
import Vue from 'vue'
import Axios from 'axios'
import router from '../../router'
import querystring from 'querystring'

Vue.prototype.axios = Axios.create({
  baseURL: '/webapiapp/'
})
Axios.interceptors.request.use(config => {
  let user = querystring.parse(localStorage.getItem('user'))
  let token = user.token
  if (token) {
    config.headers.token = token
  }
  return config
})
Axios.interceptors.response.use(response => {
  let result = response.data
  if (!result.success) {
    Vue.prototype.indicator.close()
    if (result.code === 9999) {
      // 未登录或者登录过期
      Vue.prototype.messageBox.alert(result.msg).then(action => {
        if (action === 'confirm') {
          // 如果是在APP内部，那么就跳转到APP内部的登录页面
          let isAndroid = navigator.userAgent.includes('BossShangeXue-Android')
          let isIOS = navigator.userAgent.includes('BossShangeXue-iOS')
          if (isAndroid) {
            window.BossAndroid.startLoginPage()
          } else if (isIOS) {
            window.webkit.messageHandlers.startLoginPage.postMessage({})
          } else {
            router.push('/login')
          }
        }
      })
    } else {
      Vue.prototype.toast({
        message: result.msg,
        duration: 1000
      })
    }
  }
  return response
}, error => {
  return Promise.reject(error)
})
