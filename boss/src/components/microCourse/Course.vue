<template>
  <div class="micro-course" @click="toDetail">
    <div class="course-img">
      <img :src="$root.imgBaseurl + course.classCover">
      <span class="course-duration" v-if="showDuration">{{course.classLength|duration}}</span>
    </div>
    <div class="course-info">
      <h3 class="title text-ellipsis-2">{{course.classTitle}}</h3>
      <div>
        <span class="skim">{{course.viewCount | viewCount}}播放</span>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: {
    course: {
      type: Object,
      required: true
    },
    showDuration: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toDetail () {
      this.$router.push(`/microCourseDetail/${this.course.id}`)
    }
  }
}
</script>
<style lang="less" scoped>
  .micro-course{
    height: .84rem;
    overflow: hidden;
    & + .micro-course {
      margin-top: .15rem;
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
    .course-duration{
      position: absolute;
      right: .1rem;
      bottom: .1rem;
      padding: 2px 5px;
      border-radius: .08rem;
      background: rgba(0,0,0,.2);
      font-size: .11rem;
      color: #ffffff;
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
</style>
