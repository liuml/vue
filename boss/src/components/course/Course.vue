<template>
  <div class="course" @click="toCourseDetail">
    <div class="course-banner">
      <span class="address">{{course.city}}</span>
      <img :src="$root.imgBaseurl + course.coverImage" alt="">
      <span class="status-button" :class="{review: course.nowDate > course.endTime}">
                {{course.nowDate|courseStatus(course.beginTime,course.endTime,course.selseatBeginTime,course.selseatEndTime)}}
              </span>
    </div>
    <div class="course-detail">
      <h3 class="title text-ellipsis">{{course.title}}</h3>
      <div class="address-date">
        <span>{{course.province}}·{{course.city}}</span>
        <span>{{course.beginTime|dateformat('yyyy年mm月dd日')}}</span>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  methods: {
    toCourseDetail () {
      if (this.$root.isAndroid) {
        window.BossAndroid.bsxOpenSch(this.course.id)
      } else if (this.$root.isIOS) {
        window.webkit.messageHandlers.bsxOpenSch.postMessage({id: this.course.id})
      } else {
        this.$router.push(`/courseDetail/${this.course.id}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .course{
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
    .course-banner {
      border-radius:4px;
      overflow: hidden;
      height: 1.5rem;
      & > img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .course-detail{
      padding: .08rem .05rem 0;
      & > .title{
        line-height: .24rem;
        font-size: .16rem;
        font-weight: normal;
      }
      & > .address-date{
        line-height: .2rem;
        font-size: .13rem;
        color: #999;
      }
    }
    .status-button{
      float: right;
      height: .28rem;
      line-height: .28rem;
      margin: -.45rem .15rem 0 0;
      transform: scale(1);
      padding: 0 7px;
      background: rgba(0,0,0,0.20);
      border-radius: .14rem;
      color: #fff;
      opacity: 0.9;
      font-size: .14rem;
      &.review::before{
        content: '';
        display: inline-block;
        width: .16rem;
        height: .16rem;
        vertical-align: text-bottom;
        background-image: url(../../assets/img/business/icon-course-review.png);
        background-size: cover;
      }
    }
  }
</style>
