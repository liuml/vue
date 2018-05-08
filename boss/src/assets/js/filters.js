/**
 * Created by liuml on 2018/4/24.
 */
import Vue from 'vue'
import dateFormat from 'dateformat'
import format from 'format-duration'
Vue.filter('courseStatus', function (now, beginTime, endTime, selseatBeginTime, selseatEndTime) {
  if (now < beginTime) {
    // 当前时间小于开课时间
    return '敬请期待'
  } else if (now >= selseatBeginTime && now <= selseatEndTime) {
    // 当前时间大于选座开始时间小于选座结束时间
    return '开始选座'
  } else if (now > endTime) {
    // 当前时间大于课程结束时间
    return '课程回看'
  }
})
Vue.filter('dateformat', function (date, fmt) {
  return dateFormat(date, fmt)
})
Vue.filter('viewCount', function (count) {
  if (count > 10000) {
    return `${Math.floor(count / 10000)}万`
  } else {
    return count
  }
})
Vue.filter('duration', function (value) {
  return format(+value * 1000)
})
Vue.filter('dynamicDate', function (value) {
  // 动态发布时间到当前时间的间隔时间，以秒为单位
  let interval = (Date.now() - value) / 1000
  if (interval < 60) {
    // 小于1分钟
    return '刚刚'
  } else if (interval < 60 * 60) {
    // 小于 1 小时
    return `${Math.trunc(interval / 60)}分钟前`
  } else if (interval < 24 * 60 * 60) {
    // 小于 1 天
    return `${Math.trunc(interval / (60 * 60))}小时前`
  } else if (interval < 7 * 24 * 60 * 60) {
    // 小于 1 周
    return `${Math.trunc(interval / (24 * 60 * 60))}天前`
  } else if (interval < 30 * 24 * 60 * 60) {
    // 小于 1 个月
    return `${Math.trunc(interval / (7 * 24 * 60 * 60))}周前`
  } else {
    return dateFormat(value, 'yyyy年mm月dd日 HH:MM')
  }
})
