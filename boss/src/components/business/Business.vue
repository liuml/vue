<template>
  <div class="business">
    <LoadMore allLoaded @on-refresh="refresh">
      <div class="search-container" :style="{background:`rgba(255,255,255,${alpha})`}" :class="alpha>0.7?'scroll':''">
        <div class="search-input" @click="$router.push('/search')"><img src="../../assets/img/business/icon-search.png" class="icon-search" alt="">输入课程或导师</div>
        <i class="ticket" @click="$root.downloadApp('请下载BossApp，使用更多功能！')"></i>
      </div>
      <div class="swiper">
        <mt-swipe :show-indicators="banners.length>1">
          <mt-swipe-item v-for="(banner,index) in banners" :key="index" @click.native="$root.bannerClick(banner)">
            <img :src="$root.imgBaseurl + banner.image">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="nav">
        <div class="nav-item" @click="$router.push('/courses')">
          <div class="icon-title">
            <img src="../../assets/img/business/icon-nav-selectseat.png" alt="">选座
          </div>
          <span class="label">线下大课随心学</span>
        </div>
        <div class="nav-item" @click="$router.push('/microCourses')">
          <div class="icon-title">
            <img src="../../assets/img/business/icon-nav-microclass.png" alt="">微课
          </div>
          <span class="label">线上干货全分享</span>
        </div>
        <div class="nav-item" @click="$router.push('/bossmall')">
          <div class="icon-title">
            <img src="../../assets/img/business/icon-nav-mail.png" alt="">商城
          </div>
          <span class="label">BOSS消费新零售</span>
        </div>
      </div>
      <div class="pannel" v-if="embaCourses.length">
        <div class="head">
          <span>EMBA课程</span>
          <more label="更多课程" url="/courses?typeId=16"></more>
        </div>
        <div class="body">
          <Course :course="embaCourses[0]"></Course>
          <ul class="emba-courses" v-if="embaCourses.length > 1">
            <li class="course-item"
                v-for="(embaCourse,index) in embaCourses"
                v-if="index>0"
                :key="index"
                @click="$router.push(`/courseDetail/${embaCourse.id}`)">
              <span class="address">{{embaCourse.city}}</span>
              <img :src="$root.imgBaseurl + embaCourse.coverImage">
              <div class="info">
                <h2 class="title text-ellipsis">{{embaCourse.title}}</h2>
                <span class="msg" :class="{review: embaCourse.nowDate > embaCourse.endTime, expect:embaCourse.nowDate < embaCourse.beginTime}">
                  {{embaCourse.nowDate|courseStatus(embaCourse.beginTime,embaCourse.endTime,embaCourse.selseatBeginTime,embaCourse.selseatEndTime)}}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="pannel" v-if="fdbaCourses.length">
        <div class="head">
          <span>FDBA课程</span>
          <more label="更多课程" url="/courses?typeId=96"></more>
        </div>
        <div class="body">
          <Course :course="fdbaCourses[0]"></Course>
          <ul class="fdba-courses" v-if="fdbaCourses.length > 2">
            <li class="course-item"
                v-for="(course,index) in fdbaCourses"
                :key="index"
                v-if="index > 0"
                @click="$router.push(`/courseDetail/${course.id}`)">
              <h3 class="title text-ellipsis-2">{{course.title}}</h3>
              <div class="teacher">
                <div class="avatar"><img :src="$root.imgBaseurl + course.teacherSmallHeader" alt="teacher avatar"></div>
                <div>{{course.city}}·{{course.teacherName}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="pannel" v-if="peCourses.length">
        <div class="head">
          <span>PE课程</span>
          <more label="更多课程" url="/courses?typeId=128"></more>
        </div>
        <div class="body">
          <Course :course="peCourses[0]"></Course>
        </div>
      </div>
      <div class="pannel" v-if="microClass.length">
        <div class="head">
          <span>微课精选</span>
          <more label="更多课程" url="/microCourses"></more>
        </div>
        <div class="body">
          <ul class="micro-courses">
            <li v-for="course in microClass" :key="course.id" is="micro-course" :course="course"></li>
          </ul>
        </div>
      </div>
      <div class="pannel branchs" v-if="branches.length">
        <div class="head">
          <span>BOSS分院</span>
        </div>
        <div class="body" :style="{height: branches.length < 5 ? '1.5rem':'2.7rem'}">
          <mt-swipe :auto="0" :continuous="false">
            <mt-swipe-item v-for="index in Math.ceil(branches.length/8)" :key="index">
              <ul>
                <li v-for="(branch,i) in branches"
                    v-if="i < 8 * index && i >= (index - 1) * 8"
                    :key="branch.id"
                    @click="$router.push(`/branch/${branch.id}`)">
                  <img :src="$root.imgBaseurl + branch.schoolIcon" alt="">
                  <div class="label">{{branch.schoolName}}</div>
                </li>
              </ul>
            </mt-swipe-item>
          </mt-swipe>
        </div>
      </div>
      <div class="weekly" v-if="advertisement" @click="$root.bannerClick(advertisement)">
        <img :src="$root.imgBaseurl + advertisement.image" alt="">
      </div>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import More from '../More.vue'
import Course from '../course/Course.vue'
import MicroCourse from '../microCourse/Course.vue'
export default{
  components: {
    LoadMore,
    More,
    Course,
    MicroCourse
  },
  data () {
    return {
      scroll: false,
      alpha: 0,
      banners: [],
      embaCourses: [],
      fdbaCourses: [],
      peCourses: [],
      microClass: [],
      branches: [],
      advertisement: {}
    }
  },
  created () {
    this.regScrollEvent()
    this.initData()
  },
  methods: {
    refresh (loadmore) {
      this.initData()
      loadmore.onTopLoaded()
    },
    initData () {
      this.getBanners()
      this.getEmbaCourses()
      this.getFdbaCourses()
      this.getPeCourses()
      this.getMicroClass()
      this.getBranches()
      this.getAdvertisement()
    },
    getBanners () {
      this.axios.get(`public/publishImages.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.banners = result.data
          }
          this.indicator.close()
        })
    },
    getEmbaCourses () {
      this.axios.get(`businesscourse/homePageEMBA.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.embaCourses = result.data
          }
        })
    },
    getFdbaCourses () {
      this.axios.get(`businesscourse/homePageFDBA.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.fdbaCourses = result.data
          }
        })
    },
    getPeCourses () {
      this.axios.get(`businesscourse/homePagePE.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.peCourses = result.data
          }
        })
    },
    getMicroClass () {
      this.axios.get(`micclass/homeMicClass.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.microClass = result.data
          }
        })
    },
    getBranches () {
      this.axios.get(`public/branchColleges.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.branches = result.data
          }
        })
    },
    getAdvertisement () {
      this.axios.get(`public/homeBottomImage.do`)
        .then(response => {
          let result = response.data
          if (result.success) {
            this.advertisement = result.data[0]
          }
        })
    },
    regScrollEvent () {
      // 注册滚动事件，调整搜索框的背景透明度和电子票的图片
      window.addEventListener('scroll', () => {
        let scrollHeight = 120
        let scrollTop = document.body.scrollTop
        if (scrollTop >= scrollHeight) {
          this.alpha = 1
        }
        this.alpha = scrollTop / scrollHeight > 1 ? 1 : (scrollTop / scrollHeight).toFixed(1)
      })
    }
  }
}
</script>
<style lang="less">
  .business{
    padding-bottom: .5rem;
    .search-container{
      display: flex;
      position: fixed;
      left: 0;
      right: 0;
      box-sizing: border-box;
      padding: .1rem .15rem;
      z-index:1;
      & > .search-input{
        flex: 1;
        line-height: .3rem;
        background:rgba(255,255,255,0.90);
        border-radius: .83rem;
        padding: 0 .1rem;
        font-size: .13rem;
        color: #83838b;
      }
      .icon-search{
        width: .15rem;
        margin-right: 5px;
        vertical-align: text-bottom;
      }
      & > .ticket{
        flex: 0 0 .33rem;
        display: inline-block;
        height: .3rem;
        width: .33rem;
        margin-left: .15rem;
        background-image: url(../../assets/img/business/icon-ticket.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      &.scroll{
        .search-input{
          background-color: #f4f4f4;
        }
        .ticket{
          background-image: url(../../assets/img/business/icon-ticket-black.png);
        }
      }
    }
    .swiper{
      height: 2.35rem;
      .mint-swipe-item {
        &::after{
          content: '';
          display: block;
          height: .4rem;
          background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1));
          transform: translateY(-100%);
        }
        img{
          width: 100%;
          height: 100%;
        }
      }
      .mint-swipe-indicators{
        bottom: .6rem;
        .mint-swipe-indicator{
          border-top: 3px solid transparent;
          border-bottom: 3px solid transparent;
          border-radius: 0;
          background:#ffffff;
          background-clip: content-box;
          opacity: 1;
          &.is-active{
            border: 2px solid #ffffff;
            background: transparent;
            border-radius: 50%;
          }
        }
      }
    }
    .nav{
      display: flex;
      margin: -.5rem .15rem 0;
      position: relative;
      background: #ffffff;
      box-shadow:0 0 8px 0 rgba(0,0,0,0.10);
      border-radius: 8px;
      .nav-item{
        flex: 1;
        padding: .22rem 0;
        text-align: center;
        .icon-title{
          line-height: .2rem;
          font-size: .14rem;
          & > img{
            height: .2rem;
            margin-right: .1rem;
            vertical-align: top;
          }
        }
        .label{
          font-size: .12rem;
          color:#8b8c93;
        }
      }
    }
    .pannel{
      padding: 0 .15rem;
      & > .head{
        display: flex;
        justify-content: space-between;
        padding: .35rem 0 .25rem;
        font-size: .19rem;
        font-weight: bold;
        line-height: .25rem;
      }
      .address{
        position: absolute;
        line-height: .24rem;
        padding: 0 4px;
        margin-left: .15rem;
        background-image: url(../../assets/img/business/icon-address-bg.png);
        background-size: 100% 100%;
        color: #ffffff;
        font-size: .12rem;
      }
    }
    .emba-courses{
      margin-top: .1rem;
      overflow: hidden;
      .course-item{
        float: left;
        width: calc(50% - .05rem);
        margin-top: .1rem;
        background: #f7f7f7;
        border-radius: 4px;
        overflow: hidden;
        &:nth-child(even){
          margin-left: .1rem;
        }
        .info{
          padding: 0 .1rem .1rem;
        }
        .title{
          margin-bottom: 4px;
          font-size: .15rem;
          font-weight: normal;
          line-height: .2rem;
        }
        .msg{
          font-size: .14rem;
          color: #999;
          &.review::before{
            content: '';
            display: inline-block;
            width: .16rem;
            height: .16rem;
            background-image: url(../../assets/img/business/icon-course-review-small.png);
            background-size: cover;
            vertical-align: text-bottom;
          }
          &.expect::after{
            content: '...';
          }
        }
        img{
          width: 100%;
          height: .72rem;
        }
      }
    }
    .fdba-courses{
      margin-top: .1rem;
      overflow: hidden;
      .course-item{
        float: left;
        width: calc(50% - .05rem);
        padding: .12rem .15rem .14rem;
        margin-top: .1rem;
        background:#f9f9f9;
        border-radius: 4px;
        &:nth-child(even){
          margin-left: .1rem;
        }
        & > .title{
          line-height: .2rem;
          margin-bottom: .1rem;
          font-size: .15rem;
          font-weight: normal;
        }
        & > .teacher{
          display: flex;
          font-size: .14rem;
          color: #999;
        }
        .avatar{
          flex: 0 0 .24rem;
          width: .24rem;
          margin-right: 7px;
          border-radius: 50%;
          & > img{
            width: 100%;
            border-radius: inherit;
          }
        }
      }
    }
    .branchs{
      margin-top: .35rem;
      box-shadow: inset 0 4px 6px 0 rgba(48,38,38,0.08);
      .body{
        height: 2.5rem;
      }
      ul{
        overflow: hidden;
        margin-right: -.28rem;
        & > li {
          float: left;
          margin-right: .28rem;
          margin-bottom: .2rem;
          text-align: center;
          & > img{
            width: .64rem !important;
            height: .64rem;
          }
          .label{
            width: .64rem;
            margin-top: 6px;
            font-size: .13rem;
          }
        }
      }
      .mint-swipe-indicator{
        background: #e4e4e4;
        opacity: 1;
        &.is-active{
          background: #C4C4C4;
          border-radius:19px;
          width:25px;
        }
      }
    }
    .weekly{
      padding: 0 .15rem;
      margin: .4rem 0 .2rem;
      img{
        display: block;
        width: 100%;
      }
    }
  }
</style>
