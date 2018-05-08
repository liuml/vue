<template>
  <div class="publish">
    <div class="avatar"><img :src="user.avatar?$root.imgBaseurl + user.avatar:require('../../assets/img/mine/icon-avatar.png')" alt=""></div>
    <div class="publish-input" @click="$root.downloadApp('请下载BossApp发布动态！')" :style="{background:bgColor,color:color}">
      <i class="icon-trangle" :style="{borderTopColor: bgColor,borderLeftColor:bgColor}"></i>点我发布动态
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import querystring from 'querystring'
export default {
  props: {
    bgColor: {
      type: String,
      default: '#fafafa'
    },
    color: {
      type: String,
      default: '#999999'
    }
  },
  data () {
    return {
      user: {}
    }
  },
  created () {
    let user = querystring.parse(localStorage.getItem('user'))
    if (user && user.id) {
      this.getUserInfo(user.id)
    }
  },
  methods: {
    getUserInfo (userId) {
      this.axios.get(`user/userInfo.do`, {
        params: {
          userId: userId
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.user = result.data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .publish{
    overflow: hidden;
    margin-bottom: .12rem;
    .avatar{
      width: .36rem;
      height: .36rem;
      border-radius: 50%;
      float: left;
      & > img{
        width: 100%;
        border-radius: inherit;
        vertical-align: top;
      }
    }
    .publish-input{
      line-height: .34rem;
      margin-left: .46rem;
      padding: 0 12px;
      border-radius: 5px;
      .icon-trangle{
        border: 5px solid;
        border-color: transparent;
        display: block;
        position: absolute;
        margin-top: calc(.34rem / 2 - 5px);
        margin-left: -17px;
        border-top-left-radius: 3px;
        transform: rotate(-45deg);
      }
    }
  }
</style>
