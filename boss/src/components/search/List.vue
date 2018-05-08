<template>
  <div class="container">
    <mt-header title="搜索" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :allLoaded="allLoaded" :loading="loading" @on-refresh="refresh" @on-loadmore="loadmore">
      <template v-if="type==='user'">
        <User v-for="user in list" :key="user.id" :user="user"></User>
      </template>
      <template v-else>
        <component :is="type" v-for="course in list" :course="course" :key="course.id"></component>
      </template>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import MicroCourse from '../microCourse/Course.vue'
import Course from '../course/Course.vue'
import User from '../personal/User.vue'
export default{
  components: {
    LoadMore,
    MicroCourse,
    Course,
    User
  },
  data () {
    return {
      allLoaded: false,
      loading: false,
      list: [],
      pageSize: 10,
      type: this.$route.params.type,
      keyWord: this.$route.query.keyword
    }
  },
  methods: {
    getCourses (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`businesscourse/list.do`, {
          params: {
            pageNo: pageNo,
            pageSize: this.pageSize,
            keyWord: this.keyWord
          }
        }).then((response) => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    getMicroCourses (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`micclass/list.do`, {
          params: {
            keyWord: this.keyWord,
            pageSize: this.pageSize,
            pageNo: pageNo
          }
        }).then((response) => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    getUsers (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`user/search.do`, {
          params: {
            keyWord: this.keyWord,
            pageSize: this.pageSize,
            pageNo: pageNo
          }
        }).then((response) => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    setList (result, pageNo) {
      if (result.success) {
        if (result.data && result.data.length) {
          this.list = pageNo === 1 ? result.data : this.list.concat(result.data)
          if (result.data.length < this.pageSize) {
            this.allLoaded = true
          } else {
            this.loading = false
          }
        } else {
          this.allLoaded = true
        }
      }
    },
    loadmore () {
      this.loading = true
      let pageNo = this.list.length / this.pageSize + 1
      switch (this.type) {
        case 'user':
          this.getUsers(pageNo).then(result => {
            this.setList(result, pageNo)
          })
          break
        case 'course':
          this.getCourses(pageNo).then(result => {
            this.setList(result, pageNo)
          })
          break
        case 'microCourse':
          this.getMicroCourses(pageNo).then(result => {
            this.setList(result, pageNo)
          })
          break
      }
    },
    refresh (loadmore) {
      this.allLoaded = false
      this.loading = false
      switch (this.type) {
        case 'user':
          this.getUsers(1).then(result => {
            this.setList(result, 1)
          })
          break
        case 'course':
          this.getCourses(1).then(result => {
            this.setList(result, 1)
          })
          break
        case 'microCourse':
          this.getMicroCourses(1).then(result => {
            this.setList(result, 1)
          })
          break
      }
      loadmore.onTopLoaded()
    }
  }
}
</script>
<style lang="less" scoped>
.container{
  padding-top: .44rem;
  .micro-course, .course{
    margin: .2rem .15rem;
  }
}
</style>
