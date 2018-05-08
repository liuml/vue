<template>
  <div class="course-detail">
    <mt-header fixed :style="{background:`rgba(255,255,255,${alpha})`}">
      <i class="icon-back" :class="{black: black}" slot="left" @click="$router.go(-1)"></i>
    </mt-header>
    <LoadMore :loading="loading" :allLoaded="allLoaded" @on-refresh="refresh" @on-loadmore="loadmore">
      <div class="header">
        <div class="course-img" ref="courseImg">
          <img :src="$root.imgBaseurl+detail.coverImage">
          <span class="city">{{detail.city}}</span>
        </div>
        <div class="course-info">
          <h1 class="title">{{detail.title}}</h1>
          <div class="datetime">{{detail.beginTime|dateformat('mm月dd HH:MM')}}-{{detail.endTime|dateformat('mm月dd HH:MM')}}</div>
          <div class="address">{{detail.province}}·{{detail.city}}&nbsp;&nbsp;{{detail.address}}</div>
          <div class="see-address" @click="$root.downloadApp('请下载BossApp查看详细位置！')">查看位置</div>
        </div>
      </div>
      <div class="panel intro">
        <h2 class="panel-head">课程详情</h2>
        <div class="panel-body">
          <Introduct :html="introduction"></Introduct>
        </div>
      </div>
      <div class="panel" v-if="detail.course && detail.course.length">
        <h2 class="panel-head">课题 <span>({{detail.course.length}}课题)</span></h2>
        <div class="panel-body">
          <ul>
            <li is="Topic" v-for="topic in detail.course" :topic="topic" :key="topic.id"></li>
          </ul>
        </div>
      </div>
      <div class="panel users" v-if="detail.users && detail.users.length">
        <h2 class="panel-head">已选座 <span>({{detail.maxCount}}人)</span></h2>
        <div class="panel-body">
          <div class="avatar" v-for="(user,index) in detail.users" :key="user.id" v-if="index<7 || detail.maxCount<=8" @click="$router.push(`/personal/${user.id}`)">
            <img :src="$root.imgBaseurl+user.avatar">
          </div>
          <div class="user-more" v-if="detail.maxCount>8" @click="$router.push(`/users/${detail.id}`)">
            <img src="../../assets/img/courseDetail/icon-more-user.png" alt="">
          </div>
        </div>
      </div>
      <div class="panel">
        <h2 class="panel-head">课程动态 <span>({{dynamicAll}}条)</span></h2>
        <div class="panel-body">
          <PublishDynamic></PublishDynamic>
          <template v-if="dynamics.length">
            <Dynamic v-for="dynamic in dynamics" :key="dynamic.id" :dynamic="dynamic"></Dynamic>
          </template>
        </div>
      </div>
    </LoadMore>
    <div class="btn-wrapper">
      <mt-button type="primary" size="large">下载APP查看座位及选座</mt-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import Introduct from '../Introduct.vue'
import Topic from './Topic.vue'
import PublishDynamic from '../dynamic/PublishDynamic.vue'
import Dynamic from '../dynamic/Dynamic.vue'
export default{
  components: {
    LoadMore,
    Introduct,
    Topic,
    PublishDynamic,
    Dynamic
  },
  data () {
    return {
      id: this.$route.params.id,
      detail: {},
      introduction: '',
      loading: false,
      allLoaded: false,
      pageSize: 10,
      dynamics: [],
      dynamicAll: 0,
      black: false,
      alpha: 0
    }
  },
  mounted () {
    this.regScrollEvent()
    if (this.id) {
      this.getDetail(this.id)
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollFn)
  },
  methods: {
    getDetail (id) {
      this.axios.get(`businesscourse/detail.do`, {
        params: {
          id: id
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.detail = result.data
          this.detail.richHtmlId && this.getIntroduction(this.detail.richHtmlId)
        }
      })
    },
    getIntroduction (id) {
      this.axios.get(`public/richhtmlgetContent.do`, {
        params: {
          id: id
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.introduction = result.data.content
        }
      })
    },
    getDynamics (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`dynamic/list.do`, {
          params: {
            pageSize: this.pageSize,
            pageNo: pageNo,
            type: 9,
            typeId: this.id
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
      if (this.id) {
        this.getDetail(this.id)
        this.getDynamics(1).then(result => {
          if (result.success) {
            if (result.data && result.data.length) {
              this.dynamics = result.data
              if (result.data.length < this.pageSize) {
                this.allLoaded = true
                this.loading = true
              }
            } else {
              this.allLoaded = true
            }
          }
          loadmore.onTopLoaded()
        })
      }
      loadmore.onTopLoaded()
    },
    loadmore () {
      this.loading = true
      let pageNo = this.dynamics.length / this.pageSize + 1
      this.getDynamics(pageNo).then(result => {
        if (result.success) {
          this.dynamicAll = result.count
          if (result.data && result.data.length) {
            this.dynamics = pageNo === 1 ? result.data : this.dynamics.concat(result.data)
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
            } else {
              this.loading = false
            }
          } else {
            this.allLoaded = true
          }
        }
      })
    },
    regScrollEvent () {
      // 注册滚动事件
      window.addEventListener('scroll', this.scrollFn)
    },
    scrollFn () {
      let scrollHeight = this.$refs.courseImg.clientHeight
      let scrollTop = document.body.scrollTop
      if (scrollTop >= scrollHeight) {
        this.black = true
        this.alpha = 1
      } else {
        this.black = false
        this.alpha = scrollTop / scrollHeight > 1 ? 1 : (scrollTop / scrollHeight).toFixed(1)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.course-detail{
  background: #f9f9f9;
  margin-bottom: .5rem;
  .header{
    margin-bottom: .1rem;
  }
  .icon-back{
    display: inline-block;
    width: .28rem;
    height: .28rem;
    background-image: url(../../assets/img/courseDetail/icon-back.png);
    background-size: cover;
    background-repeat: no-repeat;
    &.black{
      height: .18rem;
      background-image: url(../../assets/img/courseDetail/icon-back-black.png);
      background-size: contain;
      background-position: center;
    }
  }
  .course-img{
    height: 1.62rem;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    .city{
      position: absolute;
      left: .15rem;
      bottom: 0;
      height: .22rem;
      line-height: .22rem;
      padding: 0 .12rem;
      background-image: url(../../assets/img/courseDetail/icon-city-bg.png);
      background-size: 100% 100%;
      font-size: .13rem;
      color: #ffffff;
    }
  }
  .course-info{
    padding: .2rem .15rem .3rem;
    background: #ffffff;
    font-size: .14rem;
    .title{
      margin-bottom: .2rem;
      font-size: .21rem;
    }
    .icon{
      content: '';
      display: inline-block;
      margin-right: .1rem;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      vertical-align: text-bottom;
    }
    .datetime{
      margin-bottom: 4px;
      &::before{
        .icon;
        width: .14rem;
        height: .14rem;
        background-image: url(../../assets/img/courseDetail/icon-date.png);
      }
    }
    .address{
      &::before{
        .icon;
        width: .14rem;
        height: .15rem;
        background-image: url(../../assets/img/courseDetail/icon-address.png);
      }
    }
    .see-address{
      float: right;
      margin-top: -.19rem;
      color:#cca873;
      &::after{
        content: '';
        width: .07rem;
        height: .1rem;
        display: inline-block;
        margin-left: 5px;
        background-image: url(../../assets/img/courseDetail/icon-more.png);
        background-size: cover;
      }
    }
  }
  .introduct{
    padding: 0;
  }
  .panel{
    padding: .3rem .15rem;
    margin-bottom: .1rem;
    background: #ffffff;
    &:last-child{
      margin-bottom: 0;
    }
    .panel-head{
      margin-bottom: .15rem;
      font-size: .19rem;
      span{
        font-size: .14rem;
        color: #999;
        font-weight: normal;
      }
    }
    .panel-body{
      .avatar, .user-more{
        display: inline-block;
        margin-right: 6px;
        border-radius: 50%;
        width: calc(100% / 8 - 6px);
        img{
          width: 100%;
          border-radius: inherit;
          vertical-align: middle;
        }
      }
    }
    &.intro{
      padding-bottom: .5rem;
    }
    &.users{
      .panel-body{
        font-size: 0;
      }
    }
    .publish{
      margin-top: .3rem;
    }
  }
  .btn-wrapper{
    padding: 0 .15rem;
    position: fixed;
    bottom: .1rem;
    left: 0;
    right: 0;
  }
}
</style>
