<template>
  <transition name="zoom">
    <div class="canvas" @click="hideSlider">
      <div class="pagination">{{this.index + 1}}/{{this.datalist.length}}</div>
      <ul :style="{transform: transform, width: width,height: height, transition: transition}"
          @touchstart.stop="ontouchstart" @touchmove.stop.prevent="ontouchmove" @touchend.stop="ontouchend"
      >
        <li v-for="(img,i) in datalist" :key="i">
          <img :src="$root.imgBaseurl + img" alt="">
        </li>
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
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      startTime: 0,
      height: `${window.innerHeight}px`,
      transform: '',
      transition: 'none'
    }
  },
  computed: {
    width () {
      return `${this.datalist.length * window.innerWidth}px`
    }
  },
  watch: {
    index (value) {
      this.transform = `translateX(calc(-100vw * ${value}))`
    }
  },
  methods: {
    ontouchstart (event) {
      this.startX = event.touches[0].pageX
      this.startY = event.touches[0].pageY
      this.offsetX = 0
      this.startTime = new Date() * 1
      if (this.transition === 'none') {
        this.transition = 'transform .2s ease-out'
      }
    },
    ontouchmove (event) {
      this.offsetX = event.touches[0].pageX - this.startX
      this.offsetY = event.touches[0].pageY - this.startY
      let translateX = -(window.innerWidth * this.index) + this.offsetX
      let imgHeight = event.target.clientHeight
      if (imgHeight > window.innerHeight && Math.abs(this.offsetY) > Math.abs(this.offsetX)) {
        return
      }
      this.transform = `translateX(${translateX}px)`
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
      this.transform = `translateX(calc(-100vw * ${this.index}))`
    },
    hideSlider () {
      this.transition = 'none'
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
      -webkit-backface-visibility: hidden;
    }
    li{
      display: flex;
      height: 100%;
      width: 100vw;
      justify-content: center;
      align-items: center;
      float: left;
      overflow-y: auto;
      & > img{
        width: 100%;
      }
    }
  }
</style>
