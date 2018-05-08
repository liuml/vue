/**
 * Created by liuml on 2018/5/7.
 */
import store from '../../store'
import querystring from 'querystring'
function setLoginUserInfo (user) {
  let userInfo = JSON.parse(user)
  localStorage.setItem('user', querystring.stringify(userInfo))
  store.commit('updateSyncUsered', true)
}
export default setLoginUserInfo
