<template>
  <video-player  class="video-player-box"
                 ref="videoPlayer"
                 :options="options"
                 :playsinline="true"
                 @ended="onEnded($event)"
                 @timeupdate="onTimeupdate($event)">
  </video-player>
</template>
<script type="text/ecmascript-6">
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
export default{
  props: {
    video: {
      type: Object,
      required: true
    },
    playLength: {
      type: Number,
      default: 0
    }
  },
  components: {
    videoPlayer
  },
  data () {
    return {
      options: {
        autoplay: true,
        language: 'zh-CN',
        height: window.innerWidth * 0.56,
        sources: [{
          type: 'video/mp4',
          src: this.video.videoMiddleUrl
        }, {
          type: 'video/mp4',
          src: this.video.videoHighUrl
        }],
        poster: this.$root.imgBaseurl + this.video.videoCover
      },
      currentTime: 0
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  mounted () {
    this.player.currentTime(this.playLength)
  },
  methods: {
    onEnded () {
      this.$emit('onEnd')
    },
    onTimeupdate (player) {
      this.currentTime = player.currentTime()
    }
  }
}
</script>
<style lang="less">
  .video-player-box{
    .video-js .vjs-big-play-button{
      line-height: 2em;
      height: 2em;
      width: 2em;
      left: 50%;
      top: 50%;
      margin-left: -1em;
      margin-top: -1em;
      border: 0;
      border-radius: 50%;
    }
  }
</style>
