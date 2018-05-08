<template>
  <div class="header">
    <div class="avatar" @click="toPersonal">
      <img :src="$root.imgBaseurl + info.userAvatar">
    </div>
    <div class="info">
      <span class="name" :class="userType">{{info.userName}}</span>
      <span>{{info.dynamicCreateTime|dynamicDate}}</span>
    </div>
    <div class="user-branch">{{info.userCompany}}&nbsp;&nbsp;{{info.userTitle}}</div>
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
  computed: {
    userType () {
      switch (this.info.userType) {
        case 16:
          return 'emba'
        case 30:
          return 'ban'
        case 48:
          return 'official'
        case 96:
          return 'fdba'
        case 128:
          return 'pe'
      }
    }
  },
  methods: {
    toPersonal () {
      if (this.$root.isAndroid) {
        window.BossAndroid.bsxOpenUserInfo(this.info.userId)
      } else if (this.$root.isIOS) {
        window.webkit.messageHandlers.bsxOpenUserInfo.postMessage({id: this.info.userId})
      } else {
        this.$router.push(`/personal/${this.info.userId}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .header{
    .avatar{
      float: left;
      width: .36rem;
      height: .36rem;
      border-radius: 50%;
      margin-right: .1rem;
      & > img{
        display: block;
        width: 100%;
        border-radius: inherit;
      }
    }
    .info{
      display: flex;
      justify-content: space-between;
      font-size: .12rem;
      color: #666;
      line-height: .2rem;
    }
    .name{
      font-weight: bold;
      font-size: .14rem;
      .icon{
        content: '';
        width: .2rem;
        height: .2rem;
        display: inline-block;
        margin-left: .1rem;
        vertical-align: text-bottom;
        background-size: cover;
      }
      &.official::after{
        .icon;
        background-image: url(../../assets/img/dynamic/icon-official.png);
      }
      &.ban::after{
        .icon;
        background-image: url(../../assets/img/dynamic/icon-ban.png);
      }
      &.pe::after{
        .icon;
        background-image: url(../../assets/img/dynamic/icon-pe.png);
      }
      &.fdba::after{
        .icon;
        background-image: url(../../assets/img/dynamic/icon-fdba.png);
      }
      &.emba::after{
        .icon;
        background-image: url(../../assets/img/dynamic/icon-emba.png);
      }
    }
    .user-branch{
      font-size: .11rem;
      color: #999;
    }
  }
</style>
