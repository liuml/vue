/**
 * Created by liuml on 2017/8/9.
 */
export function formate (date, pattern) {
  if (/(y+)/.test(pattern)) {
    pattern = pattern.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let key in o) {
    if (new RegExp(`(${key})`).test(pattern)) {
      let str = o[key] + ''
      pattern = pattern.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return pattern
}
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
