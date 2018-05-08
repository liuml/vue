<template>
  <div class="container">
    <mt-header title="观看历史" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :allLoaded="allLoaded" :loading="loading" @on-refresh="refresh" @on-loadmore="loadmore">
      <ul class="courses">
        <li v-for="course in courses" :key="course.id" class="micro-course" @click="toDetail(course.micClassId)">
          <div class="course-img">
            <img :src="$root.imgBaseurl + course.classCover">
          </div>
          <div class="course-info">
            <h3 class="title text-ellipsis-2">{{course.classTitle}}</h3>
            <div class="length">播放至 {{course.playLength|duration}}</div>
          </div>
        </li>
      </ul>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
export default{
  components: {
    LoadMore
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
        this.axios.get(`micclass/playerRecords.do`, {
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
    },
    toDetail (id) {
      this.$router.push(`/microCourseDetail/${id}`)
    }
  }
}
</script>
<style lang="less" scoped>
  .courses{
    padding: .05rem .15rem;
    .micro-course{
      height: .84rem;
      overflow: hidden;
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
      .course-img{
        float: left;
        width: 1.65rem;
        height: .84rem;
        position: relative;
        & > img{
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
      }
      .course-info{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 1.8rem;
        padding-top: .08rem;
        padding-bottom: .1rem;
        font-size: .13rem;
        color: #999;
        .title{
          font-size: .15rem;
          font-weight: normal;
          color: #444;
          line-height: .18rem;
        }
      }
    }
  }
</style>
