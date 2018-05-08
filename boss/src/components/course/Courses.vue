<template>
  <div class="container">
    <mt-header title="课程" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :allLoaded="allLoaded" :loading="loading" @on-refresh="refresh" @on-loadmore="loadmore">
      <ul class="courses">
        <li is="Course" v-for="course in courses" :key="course.id" :course="course"></li>
      </ul>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import Course from './Course.vue'
export default{
  components: {
    LoadMore,
    Course
  },
  data () {
    return {
      allLoaded: false,
      loading: false,
      noData: false,
      pageSize: 20,
      courses: []
    }
  },
  methods: {
    getCourses (pageNo) {
      let typeId = this.$route.query.typeId
      let params = {
        pageSize: this.pageSize,
        pageNo: pageNo
      }
      if (typeId) {
        params.typeId = typeId
      }
      return new Promise((resolve) => {
        this.axios.get(`businesscourse/list.do`, {
          params: params
        }).then((response) => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    refresh (loadmore) {
      this.loading = false
      this.allLoaded = false
      this.noData = false
      this.getCourses(1).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.courses = result.data
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
              this.loading = true
            }
          } else {
            this.noData = true
            this.allLoaded = true
          }
        }
        loadmore.onTopLoaded()
      })
    },
    loadmore () {
      this.loading = true
      let pageNo = this.courses.length / this.pageSize + 1
      this.getCourses(pageNo).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.courses = pageNo === 1 ? result.data : this.courses.concat(result.data)
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
            } else {
              this.loading = false
            }
          } else {
            this.noData = pageNo === 1
            this.allLoaded = true
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.courses{
  padding: 0 .15rem;
  .course{
    margin: .2rem 0;
  }
}
</style>
