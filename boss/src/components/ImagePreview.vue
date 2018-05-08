<template>
  <div class="preview">
    <ul class="img-list">
      <li v-for="(img,index) in imgs" :key="index" :class="`col-${col}`" :style="{backgroundImage: `url(${$root.imgBaseurl + img})`}" @click="showImg(index)"></li>
    </ul>
    <ImgSlider v-show="showSlider" v-if="imgs.length" :datalist="imgs" :index.sync="sliderIndex" @hide="onSliderHide"></ImgSlider>
  </div>
</template>
<script type="text/ecmascript-6">
import ImgSlider from './ImgSlider.vue'
export default{
  props: ['imgs'],
  components: {
    ImgSlider
  },
  data () {
    return {
      showImgLarge: false,
      showSlider: false,
      sliderIndex: 0
    }
  },
  computed: {
    col () {
      let imgNum = this.imgs.length
      let col = 1
      if (imgNum > 1) {
        switch (imgNum) {
          case 2:
          case 4:
            col = 2
            break
          default:
            col = 3
        }
      }
      return col
    }
  },
  methods: {
    showImg (index) {
      this.sliderIndex = index
      this.showSlider = true
    },
    onSliderHide () {
      this.showSlider = false
    }
  }
}
</script>
<style lang="less" scoped>
  .img-list{
    width: 100%;
    font-size: 0;
    margin-right: -5px;
    & > li {
      width: 0;
      height: 0;
      margin-right: 5px;
      margin-bottom: 5px;
      display: inline-block;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      &.col-1{
        width: 100%;
        padding: 28%;  //16:9的图片
      }
      &.col-2{
        padding: calc((50% - 5px) / 2);
      }
      &.col-3{
        padding: calc((100% / 3 - 5px) / 2);
      }
    }
  }
</style>
