<template>
  <transition name="zoom">
    <div class="canvas" @click="hideSlider">
      <div class="pagination">{{this.index + 1}}/{{this.datalist.length}}</div>
      <ul :style="{height: height}"
          @touchstart.stop="ontouchstart" @touchmove.stop.prevent="ontouchmove" @touchend.stop="ontouchend"
      >
        <li v-show="index>0"><img :src="$root.imgBaseurl + datalist[index - 1]" v-if="index>0"></li>
        <li><img :src="$root.imgBaseurl + datalist[index]"></li>
        <li v-show="index<datalist.length-1"><img :src="$root.imgBaseurl + datalist[index + 1]" v-if="index<datalist.length-1"></li>
      </ul>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    datalist: {
      type: Array,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      startX: 0,
      offsetX: 0,
      startTime: 0,
      height: `${window.innerHeight}px`
    }
  },
  watch: {
    index (value) {
      console.log(value)
    }
  },
  methods: {
    ontouchstart (event) {
      this.startX = event.touches[0].pageX
      this.offsetX = 0
      this.startTime = new Date() * 1
    },
    ontouchmove (event) {
      this.offsetX = event.touches[0].pageX - this.startX
    },
    ontouchend () {
      let endTime = new Date() * 1
      let boundary = window.innerWidth / 5
      // 慢慢滑动的时候
      if (endTime - this.startTime > 800) {
        if (this.offsetX >= boundary) {
          this.go('-1')
        } else if (this.offsetX <= -boundary) {
          this.go('1')
        } else {
          this.go('0')
        }
      } else {
        // 滑动距离没有超过边界值但是时间短
        if (this.offsetX > 50) {
          this.go('-1')
        } else if (this.offsetX < -50) {
          this.go('1')
        } else {
          this.go('0')
        }
      }
    },
    go (n) {
      let cindex
      let length = this.datalist.length
      // 滑动到第 n 张图片
      if (typeof n === 'number') {
        cindex = n
      } else if (typeof n === 'string') {
        cindex = this.index + n * 1
      }
      if (cindex > length - 1) {
        cindex = length - 1
      } else if (cindex < 0) {
        cindex = 0
      }
      this.$emit('update:index', cindex)
    },
    hideSlider () {
      this.$emit('hide')
    }
  }
}
</script>
<style lang="less" scoped>
  .canvas{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: #000;
    overflow: hidden;
    z-index: 2;
    .pagination{
      padding: .1rem;
      position: absolute;
      z-index: 1;
      color: #fff;
    }
    ul{
      overflow: hidden;
    }
    li{
      position: absolute;
      display: flex;
      align-items: center;
      height: 100%;
      width: 100vw;
      -webkit-backface-visibility: hidden;
      &:first-child{
        transform: translate3d(-100vw, 0, 0);
      }
      &:last-child{
        transform: translate3d(100vw, 0, 0);
      }
      & > img{
        width: 100%;
      }
    }
  }
</style>
