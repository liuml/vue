<template>
  <div class="live">
    <div class="datetime">
      <div class="date">{{new Date(live.createTime).getDate()}}</div>
      <div class="time">{{live.createTime|dateformat('HH:MM')}}</div>
    </div>
    <div class="main">
      <h2 class="title">{{live.title}}</h2>
      <p class="content">{{live.content}}</p>
      <ImgPreview :imgs="live.images"></ImgPreview>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import ImgPreview from '../ImagePreview.vue'
export default{
  props: {
    live: {
      type: Object,
      required: true
    }
  },
  components: {
    ImgPreview
  }
}
</script>
<style lang="less" scoped>
.live{
  padding: .2rem .15rem;
  display: flex;
  .datetime{
    flex: 0 0 .5rem;
    padding-top: .04rem;
    margin-right: .15rem;
    background-image: url(../../assets/img/live/live-date-bg.png);
    background-size: 100% auto;
    background-repeat: no-repeat;
    text-align: center;
    .date{
      font-size: .18rem;
      color: #c7c7c7;
    }
    .time{
      font-size: .11rem;
      color: #666;
    }
  }
  .main{
    flex: 1;
    margin-top: .05rem;
    line-height: .22rem;
    .title{
      margin-bottom: .15rem;
      font-size: .15rem;
      font-weight: normal;
      color: #333;
    }
    .content{
      margin-bottom: .15rem;
      font-size: .14rem;
      color: #666;
    }
  }
}
</style>
