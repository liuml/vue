<template>
  <div class="container">
    <mt-header fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <Search placeholder="输入搜索内容" v-model="keyword" @on-search="search" @clear="refresh"></Search>
    <LoadMore allLoaded @on-refresh="refresh">
      <div class="search-page">
        <Keywords :list="keywords" @search="keywordSearch" v-show="!users.length && !courses.length && !microCourses.length"></Keywords>
        <div class="results">
          <template v-if="users.length">
            <div class="type">用户</div>
            <User v-for="(user,index) in users" :key="user.id" :user="user" v-if="index<5"></User>
            <mt-button type="default" size="large" class="more-btn" v-if="users.length>5" @click.native="$router.push(`/searchlist/user?keyword=${keyword}`)">查看更多</mt-button>
          </template>
          <template v-if="courses.length">
            <div class="type">课程</div>
            <Course v-for="(course,index) in courses" :key="course.id" :course="course" v-if="index<5"></Course>
            <mt-button type="default" size="large" class="more-btn" v-if="courses.length>5" @click.native="$router.push(`/searchlist/course?keyword=${keyword}`)">查看更多</mt-button>
          </template>
          <template v-if="microCourses.length">
            <div class="type">微课</div>
            <MicroCourse v-for="(course,index) in microCourses" :key="course.id" :course="course" v-if="index<5"></MicroCourse>
            <mt-button type="default" size="large" class="more-btn" v-if="microCourses.length>5" @click.native="$router.push(`/searchlist/microCourse?keyword=${keyword}`)">查看更多</mt-button>
          </template>
        </div>
      </div>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import Search from './SearchBar.vue'
import Keywords from './Keywords.vue'
import MicroCourse from '../microCourse/Course.vue'
import Course from '../course/Course.vue'
import User from '../personal/User.vue'
import querystring from 'querystring'
export default{
  components: {
    LoadMore,
    Search,
    Keywords,
    MicroCourse,
    Course,
    User
  },
  data () {
    return {
      keywords: [],
      courses: [],
      microCourses: [],
      users: [],
      keyword: ''
    }
  },
  created () {
    this.getKeywords()
  },
  methods: {
    getKeywords () {
      this.axios.get(`public/keyword.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.keywords = result.data
            this.indicator.close()
          }
        })
    },
    search () {
      this.indicator.open('加载中...')
      this.axios.post(`public/search.do`, querystring.stringify({
        keyWord: this.keyword
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.indicator.close()
          if (result.data.length) {
            result.data.forEach((item) => {
              switch (item.flag) {
                case 2:
                  this.courses.push(item)
                  break
                case 4:
                  this.microCourses.push(item)
                  break
                case 8:
                  this.users.push(item)
                  break
              }
            })
          } else {
            this.toast({
              message: '换个关键词试试',
              duration: 1000
            })
          }
        }
      })
    },
    refresh (loadmore) {
      this.keyword = ''
      this.users = []
      this.courses = []
      this.microCourses = []
      loadmore && loadmore.onTopLoaded()
    },
    keywordSearch (keyword) {
      this.keyword = keyword
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
  .container{
    padding-top: .9rem;
  }
  .search-page{
    padding: 0 .15rem;
    .course, .micro-course{
      margin: .2rem 0;
    }
    .type{
      line-height: .35rem;
      background: #e4e4e4;
      margin: 0 -.15rem;
      padding: 0 .15rem;
    }
    .more-btn{
      margin-bottom: .2rem;
      background: #f9f9f9;
      box-shadow: none;
      color: #cca873;
    }
  }
</style>
