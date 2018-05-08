import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Regist from '@/components/Regist'
import Login from '@/components/Login'
import Business from '@/components/business/Business'
import Branch from '@/components/branch/Branch'
import BossDynamic from '@/components/dynamic/BossDynamic'
import DynamicDetail from '@/components/dynamic/DynamicDetail'
import Mine from '@/components/mine/Mine'
import Edit from '@/components/mine/edit/Edit'
import Setting from '@/components/mine/Setting'
import Collects from '@/components/mine/Collects'
import Records from '@/components/mine/Records'
import Dynamics from '@/components/mine/Dynamics'
import SelectedCourses from '@/components/mine/SelectedCourses'
import SetPassword from '@/components/mine/SetPassword'
import MicroCourses from '@/components/microCourse/Courses'
import MicroCourseDetail from '@/components/microCourse/CourseDetail'
import Courses from '@/components/course/Courses'
import CourseDetail from '@/components/course/CourseDetail'
import Users from '@/components/course/Users'
import RichHtml from '@/components/RichHtml'
import Personal from '@/components/personal/Homepage'
import Follows from '@/components/personal/Follows'
import FansList from '@/components/personal/FansList'
import Search from '@/components/search/SearchPage'
import Mall from '@/components/Mall'
import VipPrivilege from '@/components/VipPrivilege'
import Lives from '@/components/live/Lives'
import List from '@/components/search/List'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/regist',
      name: 'regist',
      component: Regist
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/business',
      name: 'business',
      component: Business,
      alias: '/'
    },
    {
      path: '/branch/:id',
      name: 'branch',
      component: Branch
    },
    {
      path: '/dynamic',
      name: 'dynamic',
      component: BossDynamic
    },
    {
      path: '/dynamicDetail/:id',
      name: 'dynamicDetail',
      component: DynamicDetail
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine
    },
    {
      path: '/edit',
      name: 'edit',
      component: Edit
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    },
    {
      path: '/setPassword',
      name: 'setPassword',
      component: SetPassword
    },
    {
      path: '/microCourses',
      name: 'microCourses',
      component: MicroCourses
    },
    {
      path: '/microCourseDetail/:id',
      name: 'microCourseDetail',
      component: MicroCourseDetail
    },
    {
      path: '/courses',
      name: 'courses',
      component: Courses
    },
    {
      path: '/courseDetail/:id',
      name: 'courseDetail',
      component: CourseDetail
    },
    {
      path: '/collects',
      name: 'collects',
      component: Collects
    },
    {
      path: '/records',
      name: 'records',
      component: Records
    },
    {
      path: '/dynamics',
      name: 'dynamics',
      component: Dynamics
    },
    {
      path: '/selectedCourses',
      name: 'selectedCourses',
      component: SelectedCourses
    },
    {
      path: '/richHtml/:id',
      name: 'richHtml',
      component: RichHtml
    },
    {
      path: '/personal/:id',
      name: 'personal',
      component: Personal
    },
    {
      path: '/follows/:id',
      name: 'follows',
      component: Follows
    },
    {
      path: '/fansList/:id',
      name: 'fanslist',
      component: FansList
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/bossmall',
      name: 'mall',
      component: Mall
    },
    {
      path: '/viptarget',
      name: 'vipPrivilege',
      component: VipPrivilege
    },
    {
      path: '/lives/:id',
      name: 'lives',
      component: Lives
    },
    {
      path: '/users/:id',
      name: 'users',
      component: Users
    },
    {
      path: '/searchlist/:type',
      name: 'searchlist',
      component: List
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.beforeEach((to, from, next) => {
  Vue.prototype.indicator.open('加载中...')
  let isAndroid = navigator.userAgent.includes('BossShangeXue-Android')
  let isIOS = navigator.userAgent.includes('BossShangeXue-iOS')
  switch (to.name) {
    case 'business':
    case 'dynamic':
    case 'mine':
      store.commit('updateTabbar', true)
      break
    default:
      store.commit('updateTabbar', false)
  }
  if (to.name === 'branch' && (isAndroid || isIOS)) {
    // 如果是APP内部的分院详情页，必须等APP调用方法同步完用户信息之后再放行
    if (!store.state.syncUsered) {
      let intervalId = setInterval(() => {
        if (store.state.syncUsered) {
          clearInterval(intervalId)
          next()
        }
      }, 800)
    }
  } else {
    next()
  }
})
export default router
