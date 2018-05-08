<template>
  <div>
    <div class="avatar" @click="chooseFile">
      <img :src="avatar?avatar:require('../../../assets/img/mine/icon-avatar.png')" alt="">
      <i class="icon-camera"></i>
    </div>
    <div class="croppa" v-show="showCroppa">
      <croppa v-model="croppa"
              ref="croppa"
              :disable-click-to-choose="true"
              :show-remove-button="false"
              :accept="'image/*'"
              :width="width"
              :height="width"
              :quality="1"
              :show-loading="true"
              :loading-size="50"
              :prevent-white-space="true"
              placeholder="选择图片..."
              :placeholder-font-size="14"
              @new-image="onNewImg">
      </croppa>
      <div class="option">
        <button @click="remove" class="cancel">取消</button>
        <button @click="generateImage">确定</button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: ['url'],
  data () {
    return {
      croppa: {},
      width: window.innerWidth - 40,
      showCroppa: false
    }
  },
  computed: {
    avatar () {
      return this.url
    }
  },
  methods: {
    generateImage () {
      let url = this.croppa.generateDataUrl('image/jpeg', 0.5)
      if (!url) {
        alert('no image')
        return
      }
      this.showCroppa = false
      this.$emit('generate', url)
    },
    remove () {
      this.croppa.remove()
      this.showCroppa = false
    },
    chooseFile () {
      this.croppa.chooseFile()
    },
    onNewImg () {
      this.showCroppa = true
    }
  }
}
</script>
<style lang="less" scoped>
  .avatar{
    width: .75rem;
    height: .75rem;
    position: relative;
    margin: 0 auto;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .icon-camera{
      width: .22rem;
      height: .22rem;
      position: absolute;
      right: 0;
      bottom: 0;
      background-image: url(../../../assets/img/mine/icon-camera.png);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .croppa{
    background: rgba(0,0,0,.9);
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items:center;
    z-index: 1;
    .croppa-container{
      align-self: center;
      margin: 0 auto;
      border: 1px solid #fff;
    }
    .option{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      button{
        background: #cca873;
        color: #ffffff;
        padding: .1rem .2rem;
        border-radius: .1rem;
        &.cancel{
          background: #f6f8fa;
          color: #656b79;
        }
      }
    }
  }
</style>
