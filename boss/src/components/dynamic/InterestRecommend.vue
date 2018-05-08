<template>
  <div class="recommend">
    <div class="head">
      <span>可能感兴趣的人</span>
    </div>
    <div class="content clearfix">
      <ul>
        <li :style="{backgroundColor: randomBgColors[i]}" v-for="(user, i) in data" :key="i">
          <div class="info">
            <div class="avatar"><img :src="user.avatar?$root.imgBaseurl + user.avatar:require('../../assets/img/mine/icon-avatar.png')" alt=""></div>
            <div class="intro">
              <h3 class="username">{{user.name}}</h3>
              <div class="text-ellipsis">{{user.company}}</div>
              <div class="text-ellipsis">{{user.title}}</div>
            </div>
          </div>
          <div class="follow" @click="follow(user.id)"><i class="icon-follow"></i>关注</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import More from '../More.vue'
import querystring from 'querystring'
export default{
  components: {
    More
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      randomBgColors: []
    }
  },
  created () {
    for (let i = 0; i < this.data.length; i++) {
      this.setRandomColor(i)
    }
  },
  methods: {
    random (max) {
      return Math.floor(Math.random() * (max + 1))
    },
    setRandomColor (i) {
      const bgColors = ['#FFF9F9', '#FFFAFF', '#FBFAFF', '#F9FDFF', '#F6FBF6', '#FFFDF7']
      let random = this.random(bgColors.length - 1)
      this.randomBgColors[i] = bgColors[random]
      if (i > 0 && this.randomBgColors[i - 1] === this.randomBgColors[i]) {
        this.setRandomColor(i)
      }
    },
    follow (id) {
      this.indicator.open()
      this.axios.post(`friend/attion.do`, querystring.stringify({
        userId: id
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.indicator.close()
          this.$emit('onFollowed', result.data)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .recommend{
    -webkit-overflow-scrolling : touch;
    .head{
      display: flex;
      justify-content: space-between;
      margin: .15rem 0;
      font-size: .15rem;
      font-weight: bold;
    }
    .content{
      overflow-x: auto;
      & > ul {
        width: 9999px;
        -webkit-overflow-scrolling: touch;
      }
      li {
        float: left;
        width: 2rem;
        padding: .12rem .1rem;
        border-radius: 4px;
         & + li{
           margin-left: .1rem;
         }
      }
      .info {
        overflow: hidden;
        .avatar{
          width: .6rem;
          height: .6rem;
          float: left;
          & > img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .intro{
          margin-left: .7rem;
          font-size: .12rem;
          color: #999;
          line-height: .18rem;
        }
        .username{
          line-height: .22rem;
          font-size: .15rem;
          color: #333;
        }
      }
      .follow{
        margin-top: .15rem;
        font-size: .16rem;
        color:#cca873;
        text-align: center;
        .icon-follow{
          width: .13rem;
          height: .13rem;
          margin-right: 5px;
          display: inline-block;
          background-image: url(../../assets/img/recommend/icon-follow.png);
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
    }
  }
</style>
