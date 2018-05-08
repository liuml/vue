<template>
  <div class="videos">
    <h2 class="header">选集 <span>({{list.length}}集)</span></h2>
    <ul class="video-list" :class="{open: open}">
      <li v-for="video in list" :key="video.id" class="video-item" :class="{current: currentVideoId===video.id}">
        <div class="video-cover">
          <img :src="$root.imgBaseurl+video.videoCover" alt="">
        </div>
        <div class="video-info">
          <h3 class="name text-ellipsis-2">{{video.videoName}}</h3>
          <div class="duration">时长{{video.videoLength|duration}}</div>
        </div>
      </li>
    </ul>
    <div class="all" @click="open=!open" v-if="list.length > 3">{{open?'收起':'展开全部'}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: {
    list: {
      type: Array,
      required: true
    },
    currentVideoId: {
      required: true
    }
  },
  data () {
    return {
      open: false
    }
  }
}
</script>
<style lang="less" scoped>
.videos{
  padding: 0 .15rem .2rem;
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
  .header{
    padding: .2rem 0 .05rem;
    font-size: .17rem;
    & > span{
      margin-left: .05rem;
      font-size: .14rem;
      font-weight: normal;
      color: #999;
    }
  }
  .video-list{
    max-height: 2.28rem;
    overflow-y: hidden;
    transition: max-height .3s linear;
    &.open{
      max-height: initial;
    }
  }
  .video-item{
    overflow: hidden;
    margin: .15rem 0;
    &.current{
      .name{
        color: #cca873;
      }
    }
    .video-cover{
      width: 1.2rem;
      height: .66rem;
      border-radius: 3px;
      float: left;
      margin-right: .15rem;
      img{
        width: 100%;
        height: 100%;
        border-radius: inherit;
      }
    }
    .video-info{
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name{
        margin-bottom: .05rem;
        font-size: .15rem;
      }
      .duration{
        font-size: .13rem;
        color: #999;
      }
    }
  }
  .all{
    line-height: .3rem;
    text-align: center;
    &:active{
      background: rgba(0,0,0,.1);
    }
  }
}
</style>
