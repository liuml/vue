<template>
  <div class="notes">
    <div class="img-box"
         v-for="(explain,index) in list"
         :key="index"
         v-if="index<4"
         :class="{more: list.length>4&&index===3}" @click="more(index)">
      <img :src="$root.imgBaseurl+explain">
    </div>
    <ImgSlider v-show="showSlider"
               @hide="showSlider=false"
               :datalist="list"
               :index.sync="index">
    </ImgSlider>
  </div>
</template>
<script type="text/ecmascript-6">
import ImgSlider from './AsyncImgSlider.vue'
export default{
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  components: {
    ImgSlider
  },
  data () {
    return {
      showSlider: false,
      index: 0
    }
  },
  methods: {
    more (index) {
      this.index = index
      this.showSlider = true
    }
  }
}
</script>
<style lang="less" scoped>
  .img-box{
    width: .74rem;
    height: .74rem;
    position: relative;
    margin-right: .1rem;
    display: inline-block;
    &.more{
      &::after{
        content: '更多';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background:rgba(0,0,0,0.50);
        color: #ffffff;
        font-size: .13rem;
        text-align: center;
        line-height: .74rem;
      }
    }
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
