<template>
  <div class="topic">
    <div class="topic-info">
      <div class="info">
        <h3 class="title">{{topic.mainTitle}}</h3>
        <div class="teacher">{{topic.teacherName}} {{topic.beginTime|dateformat('dd日HH:MM')}}-{{topic.endTime|dateformat('dd日HH:MM')}}</div>
      </div>
      <div class="teacher-avatar" :class="{review: !!topic.micClassId}" @click="toMicroCourse">
        <img :src="$root.imgBaseurl+topic.teacherSmallHeader">
      </div>
    </div>
    <div class="topic-item" v-if="topic.explainImages">
      <div class="item-title">课题讲义</div>
      <div class="item-content">
        <Notes :list="topic.explainImages"></Notes>
      </div>
    </div>
    <div class="topic-item" v-if="topic.noteImages">
      <div class="item-title">课堂笔记</div>
      <div class="item-content">
        <Notes :list="topic.noteImages"></Notes>
      </div>
    </div>
    <div class="topic-item teletextPo" v-if="topic.teletextPo">
      <div class="item-title">图文直播 <more label="查看更多" :url="`/lives/${topic.id}`"></more></div>
      <div class="item-content">
        {{topic.teletextPo.content}}
        <ImagePreview :imgs="topic.teletextPo.images" v-if="topic.teletextPo.images"></ImagePreview>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Notes from './TopicNotes.vue'
import More from '../More.vue'
import ImagePreview from '../ImagePreview.vue'
export default{
  props: {
    topic: {
      type: Object,
      required: true
    }
  },
  components: {
    Notes,
    More,
    ImagePreview
  },
  methods: {
    toMicroCourse () {
      if (this.topic.micClassId) {
        this.$router.push(`/microCourseDetail/${this.topic.micClassId}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.topic{
  margin-bottom: .35rem;
  position: relative;
  &:last-child{
    margin-bottom: 0;
  }
  &::after{
    content: '';
    position: absolute;
    left: -.15rem;
    right: -.15rem;
    bottom: 0;
    height: 1px;
    background: #e4e4e4;
    transform: scaleY(.5);
  }
  &:last-child::after{
    display: none;
  }
  .topic-info{
    display: flex;
    align-items: center;
    margin-bottom: .12rem;
    .info{
      flex: 1;
    }
    .title{
      margin-bottom: .05rem;
      font-size: .16rem;
    }
    .teacher{
      font-size: .14rem;
      color: #999;
    }
    .teacher-avatar{
      flex: 0 0 .66rem;
      width: .66rem;
      height: .66rem;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      border:4px solid #ffffff;
      border-radius: 50%;
      position: relative;
      &.review::after{
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.50);
        background-image: url(../../assets/img/courseDetail/icon-review.png);
        background-size: .25rem;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: inherit;
      }
      img{
        width: 100%;
        height: 100%;
        border-radius: inherit;
      }
    }
  }
  .topic-item{
    background-image: url(../../assets/img/courseDetail/icon-line.png);
    background-repeat: no-repeat;
    background-position: .06rem .12rem;
    background-size: 2px 1.1rem;
    .item-title{
      &::before{
        content: '';
        width: .14rem;
        height: .14rem;
        display: inline-block;
        margin-right: 5px;
        background-image: url(../../assets/img/courseDetail/icon-circle.png);
        background-size: cover;
        background-color: #fff;
      }
      .more{
        float: right;
      }
    }
    .item-content{
      padding: .2rem 0 .2rem .2rem;
      margin-right: -.15rem;
      font-size: .15rem;
      color: #666;
      word-break: break-all;
    }
    &.teletextPo{
      .item-content{
        margin-right: 0;
      }
      .preview{
        margin-top: .12rem;
      }
    }
  }
}
</style>
