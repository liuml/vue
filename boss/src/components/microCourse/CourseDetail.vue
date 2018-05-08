<template>
  <div class="microcourse-detail" v-if="video">
    <mt-header title="微课详情" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :loading="loading" :allLoaded="allLoaded" @on-refresh="refresh" @on-loadmore="loadmore">
      <CourseVideo ref="video" :video="video" :playLength="course.playLength" @onEnd="onEnd"></CourseVideo>
      <div class="info">
        <h1 class="title">{{course.classTitle}}</h1>
        <div class="teacher">
          <span class="name">{{course.teacherName}}</span>
          <span class="desc">{{course.teacherDes}}</span>
        </div>
        <div class="flex">
          <span class="viewcount">{{course.viewCount|viewCount}}播放</span>
          <i class="icon-collect" :class="{collected: collected}" @click="toggleCollect"></i>
        </div>
      </div>
      <Videos :list="course.videos" :currentVideoId="video.id"></Videos>
      <div class="dynamics">
        <h2 class="header">微课动态 <span>({{allDynamic}}条)</span></h2>
        <PublishDynamic></PublishDynamic>
        <ul class="dynamic-list">
          <li is="Dynamic" v-for="dynamic in dynamics" :key="dynamic.id" :dynamic="dynamic"></li>
        </ul>
      </div>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import CourseVideo from './CourseVideo.vue'
import Videos from './Videos.vue'
import PublishDynamic from '../dynamic/PublishDynamic.vue'
import Dynamic from '../dynamic/Dynamic.vue'
import querystring from 'querystring'
export default{
  components: {
    LoadMore,
    CourseVideo,
    Videos,
    PublishDynamic,
    Dynamic
  },
  data () {
    return {
      allLoaded: false,
      loading: false,
      dynamics: [],
      allDynamic: 0,
      pageSize: 5,
      course: null,
      video: null,
      videoIndex: 0,
      collected: false
    }
  },
  created () {
    this.getDetail().then(course => {
      this.course = course
      this.collected = this.course.collectStatus
      this.setCurrentVideo()
      this.indicator.close()
    })
  },
  beforeRouteLeave (to, from, next) {
    let currentTime = this.$refs.video.currentTime
    if (currentTime > 0) {
      this.addPlayerRecord(this.$refs.video.currentTime)
    }
    next()
  },
  methods: {
    getDetail () {
      let id = this.$route.params.id
      if (id) {
        return new Promise(resolve => {
          this.axios.get(`micclass/detailVideo.do`, {
            params: {
              id: id
            }
          }).then(response => {
            if (response.data.success) {
              resolve(response.data.data)
            }
          })
        })
      }
    },
    getDynamics (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`dynamic/list.do`, {
          params: {
            pageSize: this.pageSize,
            pageNo: pageNo,
            type: 101,
            typeId: this.$route.params.id
          }
        }).then((response) => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    refresh (loadmore) {
      this.videoIndex = 0
      this.allDynamic = 0
      this.loading = false
      this.allLoaded = false
      this.dynamics = []
      this.getDetail().then(course => {
        this.course = course
        this.collected = this.course.collectStatus
        this.setCurrentVideo()
        this.loadmore()
        loadmore.onTopLoaded()
      })
    },
    loadmore () {
      this.loading = true
      let pageNo = this.dynamics.length / this.pageSize + 1
      this.getDynamics(pageNo).then(result => {
        if (result.success) {
          this.allDynamic = result.count
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
    setCurrentVideo () {
      let videos = this.course.videos
      if (this.course.lastVideoId === -1) {
        this.video = videos[0]
        return
      }
      for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === this.course.lastVideoId) {
          this.video = videos[i]
          this.videoIndex = i
          break
        }
      }
    },
    onEnd () {
      // 视频播放结束自动播放下一个视频
      let videos = this.course.videos
      if (++this.videoIndex < videos.length) {
        this.video = videos[this.videoIndex]
      }
    },
    addPlayerRecord (playLength) {
      this.axios.post(`micclass/addPlayerRecord.do`, querystring.stringify({
        videoId: this.video.id,
        playLength: Math.trunc(playLength),
        micClassId: this.course.id
      })).then(response => {
        let result = response.data
        if (result.success) {
          console.log('addrecord success')
        }
      })
    },
    toggleCollect () {
      let collected = this.collected
      if (collected) {
        this.cancelCollect()
      } else {
        this.collect()
      }
    },
    collect () {
      this.axios.post(`micclass/collect.do`, querystring.stringify({
        id: this.course.id
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.collected = !this.collected
        }
      })
    },
    cancelCollect () {
      this.axios.post(`micclass/delcollect.do`, querystring.stringify({
        ids: JSON.stringify([this.course.id])
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.collected = !this.collected
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .microcourse-detail{
    padding-top: .44rem;
    .info{
      padding: .2rem .15rem .1rem;
      position: relative;
      &::after{
        content: '';
        display: block;
        height: 1px;
        background: #f0f0f0;
        transform: scaleY(0.5);
        position: absolute;
        left: .15rem;
        right: .15rem;
        bottom: 0;
      }
      .title{
        font-size: .19rem;
        margin-bottom: .1rem;
      }
      .teacher{
        margin-bottom: .1rem;
        font-size: .13rem;
        .name{
          margin-right: 5px;
        }
      }
      .flex{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .viewcount{
        font-size: .13rem;
        color: #999;
      }
      .icon-collect{
        display: block;
        width: .2rem;
        height: .2rem;
        padding: .1rem 0 .1rem .1rem;
        background-image: url(../../assets/img/microCourse/icon-collect.png);
        background-size: cover;
        box-sizing: content-box;
        background-clip: content-box;
        background-origin: content-box;
        &.collected{
          background-image: url(../../assets/img/microCourse/icon-collected.png);
        }
      }
    }
    .dynamics{
      padding: 0 .15rem .2rem;
      .header{
        padding: .2rem 0 .25rem;
        font-size: .17rem;
        & > span{
          margin-left: .05rem;
          font-size: .14rem;
          font-weight: normal;
          color: #999;
        }
      }
    }
  }
</style>
