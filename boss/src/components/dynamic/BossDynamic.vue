<template>
  <div class="boss-dynamic">
    <div class="fixed" ref="fixedHeader">
      <div class="head clearfix">
        <h1>BOSS圈</h1>
        <Selector :options="options" @onSelect="onSelect"></Selector>
      </div>
      <PublishDynamic bgColor="rgba(204,168,115,0.12)" color="#c2baae"></PublishDynamic>
    </div>
    <LoadMore :loading="loading" :allLoaded="allLoaded" @on-refresh="refresh" @on-loadmore="loadmore">
      <template v-if="selected===1">
        <NoLogin v-if="!isLogin"></NoLogin>
        <template v-else>
          <div class="no-follow-dynamic" v-if="noData">
            <img src="../../assets/img/dynamic/no-dynamic.png" alt="">
            <p>暂无关注人的动态</p>
          </div>
          <InterestRecommend :data="recommends" v-if="recommends.length" @onFollowed="followed"></InterestRecommend>
        </template>
      </template>
      <ul class="dynamics" v-if="dynamics.length">
        <li is="Dynamic" v-for="(dynamic, index) in dynamics" :key="index" :dynamic="dynamic"></li>
      </ul>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import Selector from './Selector.vue'
import PublishDynamic from './PublishDynamic.vue'
import NoLogin from './NoLogin.vue'
import InterestRecommend from './InterestRecommend.vue'
import Dynamic from './Dynamic.vue'
export default{
  components: {
    LoadMore,
    Selector,
    PublishDynamic,
    NoLogin,
    InterestRecommend,
    Dynamic
  },
  data () {
    return {
      options: [{value: '全部动态', id: 0}, {value: '我的关注', id: 1}],
      dynamics: [],
      recommends: [],
      selected: 0,
      pageSize: 10,
      isLogin: true,
      allLoaded: false,
      loading: false,
      noData: false
    }
  },
  methods: {
    onSelect (option) {
      this.selected = option.id
      this.refresh()
    },
    noLogin () {
      this.loading = true
      this.allLoaded = true
      this.dynamics = []
      return false
    },
    resetData () {
      this.dynamics = []
      this.allLoaded = false
      this.loading = false
      this.noData = false
    },
    getDynamics () {
      let pageNo = this.dynamics.length / this.pageSize + 1
      let params = {
        pageSize: this.pageSize,
        pageNo: pageNo
      }
      switch (this.selected) {
        case 0:
          params.all = 'all'
          break
        case 1:
          params.friend = 'friend'
          break
      }
      return new Promise((resolve) => {
        this.axios.get(`dynamic/list.do`, {
          params: params
        }).then((response) => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    getInterest () {
      this.axios.get(`user/interest.do`, {
        params: {
          pageNo: 1,
          pageSize: 18
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.recommends = result.data
        }
      })
    },
    refresh (loadmore) {
      if (this.selected === 1) {
        this.isLogin = !!localStorage.getItem('user')
        if (!this.isLogin) {
          loadmore && loadmore.onTopLoaded()
          return this.noLogin()
        } else {
          this.getInterest()
        }
      }
      this.resetData()
      this.getDynamics().then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.dynamics = result.data
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
              this.loading = true
            }
          } else {
            this.noData = true
            this.allLoaded = true
          }
          loadmore && loadmore.onTopLoaded()
        }
      })
      this.indicator.close()
    },
    loadmore () {
      this.loading = true
      let pageNo = this.dynamics.length / this.pageSize + 1
      this.getDynamics().then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.dynamics = pageNo === 1 ? result.data : this.dynamics.concat(result.data)
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
            } else {
              this.loading = false
            }
          } else {
            this.noData = pageNo === 1
            this.allLoaded = true
          }
        }
      })
    },
    followed (data) {
      this.toast({
        message: data,
        duration: 1000
      })
      setTimeout(() => {
        this.indicator.open('加载中...')
        this.refresh()
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
  .boss-dynamic{
    padding: 1.17rem .15rem .5rem;
    .mint-loadmore{
      min-height: 70vh !important;
    }
    .fixed{
      padding: .15rem;
      padding-bottom: 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      background: #ffffff;
    }
    .head{
      margin-bottom: .25rem;
      & > h1{
        float: left;
        font-size: .22rem;
      }
      & > .selector{
        float: right;
        line-height: .28rem;
      }
    }
    .no-follow-dynamic{
      margin-top: .7rem;
      text-align: center;
      font-size: .14rem;
      color: #999;
      img{
        width: 1.2rem;
      }
      p{
        margin: .2rem 0 .5rem;
      }
    }
  }
</style>
