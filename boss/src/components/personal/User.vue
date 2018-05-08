<template>
  <div class="user-item" @click="$router.push(`/personal/${user.userId || user.id}`)">
    <div class="avatar">
      <img :src="user.avatar?$root.imgBaseurl+user.avatar:require('../../assets/img/mine/icon-avatar.png')" alt="">
    </div>
    <div class="content">
      <h3 class="name">{{user.userName || user.name}}</h3>
      <div class="company text-ellipsis">{{user.company}} {{user.title}}</div>
    </div>
    <mt-button size="small" plain class="follow-btn" @click.native.stop="cancelFollow" v-if="user.relation && (user.relation === 1 || user.relation === 3)">已关注</mt-button>
  </div>
</template>
<script type="text/ecmascript-6">
import querystring from 'querystring'
export default{
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    cancelFollow () {
      let user = querystring.parse(localStorage.getItem('user'))
      let userId = user.id
      if (!userId) {
        // 用户未登录
        this.messageBox.alert('您还没有登录，请先登录').then(action => {
          if (action === 'confirm') {
            this.$router.push('/login')
          }
        })
        return
      }
      this.messageBox.confirm('确定要取消关注？', '取消关注').then(action => {
        if (action === 'confirm') {
          this.doCancel()
        }
      }, cancel => {})
    },
    doCancel () {
      this.axios.post(`friend/unAttion.do`, querystring.stringify({
        userId: this.user.userId
      })).then(response => {
        if (response.data.success) {
          this.toast({
            message: response.data.data,
            duration: 1000
          })
          this.$emit('unFollowed', this.user.userId)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.user-item{
  position: relative;
  padding: .15rem;
  display: flex;
  align-items: center;
  & + .user-item{
    &::after{
      content: '';
      height: 1px;
      background: #f0f0f0;
      position: absolute;
      left: .15rem;
      right: 0;
      top: 0;
      transform: scaleY(.5);
    }
  }
  .avatar{
    flex: 0 0 .5rem;
    height: .5rem;
    margin-right: .15rem;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .content{
    flex: 1;
    width: 2rem;
  }
  .follow-btn{
    float: right;
    height: .26rem !important;
    line-height: .26rem !important;
    border-radius: .15rem;
    padding: 0 .1rem;
    font-size: .13rem !important;
    color: #999;
    border: 1px solid #cecece;
  }
  .name{
    font-size: .16rem;
    line-height: .22rem;
  }
  .company{
    font-size: .13rem;
    color: #999;
  }
}
</style>
