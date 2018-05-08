<template>
  <div class="branch" v-if="branch.id" :style="{paddingTop: isApp?0:'.44rem'}">
    <mt-header :title="`${branch.schoolName}`" fixed v-if="!isApp">
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore allLoaded @on-refresh="refresh">
      <div class="swiper" v-if="branch.schoolSowMaps.length">
        <mt-swipe :show-indicators="branch.schoolSowMaps.length > 1">
          <mt-swipe-item v-for="banner in branch.schoolSowMaps" :key="banner.id" @click.native="$root.bannerClick(banner)">
            <img :src="$root.imgBaseurl+banner.image">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="icon">
        <img :src="$root.imgBaseurl + branch.schoolIcon" alt="">
      </div>
      <div class="introduction">
        <h2 class="title">{{branch.schoolName}}</h2>
        <Introduct :html="branch.introduction" v-if="branch.introduction"></Introduct>
      </div>
      <div class="courses" v-if="courses.length">
        <Title name="分院课程"></Title>
        <ul>
          <li is="Course" v-for="course in courses" :key="course.id" :course="course"></li>
        </ul>
        <div class="more">
          <mt-button type="default"
                     size="large"
                     class="more-btn"
                     :disabled="courseAllLoaded"
                     @click.native="loadmoreCourses">
            {{courseAllLoaded?'已加载全部':'更多课程'}}
        </mt-button>
        </div>
      </div>
      <div class="star-learners" v-if="starUsers.length">
        <Title name="明星学员"></Title>
        <ul>
          <li is="Learner" v-for="star in starUsers" :key="star.id" :info="star"></li>
        </ul>
      </div>
      <div class="dynamics" v-if="dynamics.length">
        <Title name="分院动态"></Title>
        <ul>
          <li is="Dynamic" v-for="dynamic in dynamics" :key="dynamic.id" :dynamic="dynamic"></li>
        </ul>
        <div class="more">
          <mt-button type="default"
                     size="large"
                     class="more-btn"
                     :disabled="dynamicAllLoaded"
                     @click.native="loadmoreDynamics">
            {{dynamicAllLoaded?'已加载全部':'更多动态'}}
        </mt-button>
        </div>
      </div>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import Introduct from '../Introduct.vue'
import Title from './Title.vue'
import Course from '../course/Course.vue'
import Learner from './StarLearner.vue'
import Dynamic from '../dynamic/Dynamic.vue'
export default {
  components: {
    LoadMore,
    Introduct,
    Title,
    Course,
    Learner,
    Dynamic
  },
  data () {
    return {
      branch: {},
      courses: [],
      starUsers: [],
      dynamics: [],
      courseAllLoaded: false,
      dynamicAllLoaded: false,
      pageSize: 3,
      // 是否在Android或者IOS APP内部
      isApp: this.$root.isAndroid || this.$root.isIOS
    }
  },
  beforeRouteLeave (to, from, next) {
    document.title = 'BOSS商学'
    next()
  },
  created () {
    let id = this.$route.params.id
    if (id) {
      this.getBranchInfo(id)
    }

  },
  methods: {
    refresh (loadmore) {
      this.getBranchInfo(this.branch.id)
      loadmore.onTopLoaded()
    },
    getBranchInfo (id) {
      this.axios.get(`public/collegeBaseInfo.do`, {
        params: {
          schoolId: id
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.branch = result.data
          document.title = `${this.branch.schoolName}`
          this.loadCourses()
          this.getStars(id)
          this.loadDynamics()
        }
      })
    },
    getCourses () {
      return new Promise(resolve => {
        this.axios.get(`businesscourse/list.do`, {
          params: {
            schoolId: this.branch.id,
            pageSize: this.pageSize,
            pageNo: this.courses.length / this.pageSize + 1
          }
        }).then(response => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    getStars (id) {
      this.axios.get(`user/starUser.do`, {
        params: {
          schoolId: id
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.starUsers = result.data
        }
      })
    },
    getDynamics () {
      return new Promise(resolve => {
        this.axios.get(`dynamic/list.do`, {
          params: {
            schoolId: this.branch.id,
            pageSize: this.pageSize,
            pageNo: this.dynamics.length / this.pageSize + 1
          }
        }).then(response => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    loadCourses () {
      let pageNo = this.courses.length / this.pageSize + 1
      this.getCourses().then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.courses = pageNo === 1 ? result.data : this.courses.concat(result.data)
            if (result.data.length < this.pageSize) {
              this.courseAllLoaded = true
            }
          } else {
            this.courseAllLoaded = true
          }
          this.indicator.close()
        }
      })
    },
    loadDynamics () {
      let pageNo = this.courses.length / this.pageSize + 1
      this.getDynamics().then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.dynamics = pageNo === 1 ? result.data : this.dynamics.concat(result.data)
            if (result.data.length < this.pageSize) {
              this.dynamicAllLoaded = true
            }
          } else {
            this.dynamicAllLoaded = true
          }
          this.indicator.close()
        }
      })
    },
    loadmoreCourses () {
      this.indicator.open('加载中...')
      this.loadCourses()
    },
    loadmoreDynamics () {
      this.indicator.open('加载中...')
      this.loadDynamics()
    }
  }
}
</script>
<style lang="less">
.branch{
  margin-bottom: .5rem;
  .swiper{
    height: 1.5rem;
    .mint-swipe-item{
      img{
        width: 100%;
        height: 100%;
      }
    }
    .mint-swipe-indicators{
      right: .15rem;
      left: auto;
      transform: none;
      .mint-swipe-indicator{
        background: #ffffff;
        opacity: .5;
        &.is-active{
          opacity: 1;
        }
      }
    }
  }
  .icon{
    padding-bottom: .08rem;
    margin-top: -.4rem;
    transform: scale(1);
    text-align: center;
    background-image: url(../../assets/img/branch/icon-bg.png);
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: 2.43rem .5rem;
    img{
      width: .8rem;
      height: .8rem;
    }
  }
  .introduction{
    .title{
      margin: .25rem 0 .12rem;
      text-align: center;
      font-size: .22rem;
    }
  }
  .course{
    margin: 0 .15rem .2rem;
  }
  .more{
    padding: 0 .15rem;
  }
  .more-btn{
    background: #f9f9f9;
    box-shadow: none;
    border-radius: 4px;
    color:#cca873;
    font-size: .16rem !important;
    height: .5rem !important;
    line-height: .5rem !important;
  }
  .star-learners{
    overflow: hidden;
    padding: 0 .15rem;
  }
  .dynamics{
    & > ul{
      padding: 0 .15rem;
    }
    .dynamic:first-child{
      padding-top: 0;
    }
  }
}
</style>
