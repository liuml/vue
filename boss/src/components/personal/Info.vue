<template>
  <div class="info" ref="info">
    <mt-header fixed :class="{black: black}" :style="{background:`rgba(255,255,255,${alpha})`}">
      <div slot="left" @click="$router.go(-1)">
        <i class="icon-back"></i>
      </div>
      <div slot="right" icon="more" v-if="data.relation!==-1">
        <i class="icon-more" v-if="data.relation===1 || data.relation===3" @click="cancelFollow"></i>
        <span class="icon-follow" v-else-if="data.relation===0 || data.relation===2" @click="follow"><img src="../../assets/img/personal/icon-follow.png">关注</span>
      </div>
    </mt-header>
    <div class="content">
      <img :src="$root.imgBaseurl + data.avatar" class="avatar">
      <h2 class="name">{{data.name}}</h2>
      <div class="company">{{data.company}}&nbsp;&nbsp;{{data.title}}</div>
      <ul class="types">
        <li v-for="type in data.userTypes"
            :key="type.typeId">
          <img :src="type.userId ? type.typeIconLight : type.typeIcon">
        </li>
      </ul>
      <div class="flex">
        <div class="left">
          <div>{{data.province}}·{{data.city}}</div>
          <div>{{data.industry}}</div>
        </div>
        <div class="right">
          <div class="item" @click="$router.push(`/follows/${id}`)">
            <div class="label">关注</div>
            <span class="num">{{data.attoinNum}}</span>
          </div>
          <div class="item" @click="$router.push(`/fansList/${id}`)">
            <div class="label">粉丝</div>
            <span class="num">{{data.fensiNum}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import querystring from 'querystring'
export default{
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      id: this.$route.params.id,
      black: false,
      alpha: 0
    }
  },
  created () {
    this.regScrollEvent()
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollFn)
  },
  methods: {
    regScrollEvent () {
      // 注册滚动事件
      window.addEventListener('scroll', this.scrollFn)
    },
    scrollFn () {
      let scrollHeight = this.$refs.info.clientHeight
      let scrollTop = document.body.scrollTop
      if (scrollTop >= scrollHeight) {
        this.black = true
        this.alpha = 1
      } else {
        this.black = false
        this.alpha = scrollTop / scrollHeight > 1 ? 1 : (scrollTop / scrollHeight).toFixed(1)
      }
    },
    cancelFollow () {
      this.messageBox.confirm('确定要取消关注？', '取消关注').then(action => {
        if (action === 'confirm') {
          this.doCancel()
        }
      }, cancel => {})
    },
    doCancel () {
      this.indicator.open('取消中...')
      this.axios.post(`friend/unAttion.do`, querystring.stringify({
        userId: this.data.id
      })).then(response => {
        if (response.data.success) {
          this.toast({
            message: response.data.data,
            duration: 1000
          })
          this.$emit('unFollowed')
        }
      })
    },
    follow () {
      this.axios.post(`friend/attion.do`, querystring.stringify({
        userId: this.data.id
      })).then(response => {
        if (response.data.success) {
          this.toast({
            message: response.data.data,
            duration: 1000
          })
          this.$emit('Followed')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.info{
  padding-top: .44rem;
  background-image: url(../../assets/img/personal/background.png);
  background-size: cover;
  .mint-header{
    /*background: transparent !important;*/
    &.black{
      .icon-back{
        background-image: url(../../assets/img/personal/icon-back-black.png);
      }
      .icon-more{
        background-image: url(../../assets/img/personal/icon-more-black.png);
      }
    }
  }
  .icon-back{
    width: .1rem;
    height: .18rem;
    display: inline-block;
    background-image: url(../../assets/img/personal/icon-back.png);
    background-size: cover;
  }
  .icon-more{
    width: .2rem;
    height: .04rem;
    display: inline-block;
    background-image: url(../../assets/img/personal/icon-more.png);
    background-size: cover;
  }
  .icon-follow{
    color:#cca873;
    font-size: .16rem;
    img{
      width: .13rem;
      height: .13rem;
      margin-right: 5px;
    }
  }
  .content{
    padding-bottom: .18rem;
    text-align: center;
    .avatar{
      width: .75rem;
      height: .75rem;
      border-radius: 50%;
    }
    .name{
      margin-top: .1rem;
      margin-bottom: .05rem;
      font-size: .24rem;
      color: #ffffff;
    }
    .company{
      font-size: .13rem;
      color: #ffffff;
      opacity: 0.7;
    }
    .types{
      margin: .2rem auto 0;
      & > li {
        width: .2rem;
        height: .2rem;
        margin: 0 .06rem;
        display: inline-block;
        & > img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .flex{
    display: flex;
    justify-content: space-between;
    margin: .4rem .15rem 0;
    font-size: .13rem;
    opacity:0.7;
    color:#ffffff;
    .left{
      text-align: left;
    }
    .right{
      .num{
        font-size: .17rem;
        font-weight: bold;
        color: #cca873;
      }
      .item{
        display: inline-block;
      }
      .item:first-child{
        margin-right: .3rem;
      }
    }
  }
}
</style>
