<template>
  <div class="container">
    <mt-header title="微课" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :allLoaded="allLoaded" :loading="loading" @on-refresh="refresh" @on-loadmore="loadmore">
      <ul class="microcourses">
        <li is="MicroCourse" v-for="course in courses" :key="course.id" :course="course" showDuration></li>
      </ul>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import MicroCourse from './Course.vue'
export default{
  components: {
    LoadMore,
    MicroCourse
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
      return new Promise((resolve) => {
        this.axios.get(`micclass/list.do`, {
          params: {
            pageSize: this.pageSize,
            pageNo: pageNo
          }
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
      this.initCourses(loadmore)
    },
    initCourses (loadmore) {
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
        loadmore && loadmore.onTopLoaded()
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
.microcourses{
  padding: .05rem .15rem;
  .micro-course{
    padding: .15rem 0;
    box-sizing: content-box;
    & + .micro-course{
      margin-top: 0;
      position: relative;
      &::after{
        content: '';
        display: block;
        height: 1px;
        background: #f0f0f0;
        transform: scaleY(0.5);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
      }
    }
  }
}
</style>
