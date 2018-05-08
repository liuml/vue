<template>
  <div class="star">
    <div class="avatar" @click="toUser">
      <img :src="$root.imgBaseurl+info.avatar" alt="avatar">
    </div>
    <div class="name">{{info.name}}</div>
    <div class="company text-ellipsis">
      <span>{{info.company}}</span>
      <span>{{info.title}}</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  methods: {
    toUser () {
      if (this.$root.isAndroid) {
        window.BossAndroid.bsxOpenRichHtml(this.info.richHtmlId)
      } else if (this.$root.isIOS) {
        window.webkit.messageHandlers.bsxOpenRichHtml.postMessage({id: this.info.richHtmlId})
      } else {
        this.$router.push(`/richHtml/${this.info.richHtmlId}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.star{
  width: 50%;
  padding: .18rem .15rem;
  float: left;
  background-image: url(../../assets/img/branch/star-bg.png);
  background-size: 100% 100%;
  text-align: center;
  .avatar{
    width: .7rem;
    height: .7rem;
    margin: 0 auto;
    border-radius: 50%;
    & > img{
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }
  }
  .name{
    margin: .1rem 0 .06rem;
    font-size: .15rem;
  }
  .company{
    font-size: .12rem;
    color: #999;
  }
}
</style>
