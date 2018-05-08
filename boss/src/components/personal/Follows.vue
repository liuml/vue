<template>
  <div class="container">
    <mt-header :title="isUser?'我的关注':'Ta的关注'" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :allLoaded="allLoaded" :loading="loading" @on-refresh="refresh" @on-loadmore="loadmore">
      <ul class="follows" v-if="follows.length">
        <li is="User" v-for="follow in follows" :key="follow.id" :user="follow" @unFollowed="refresh"></li>
      </ul>
      <NoData v-if="noData" :message="isUser?'您还没有关注任何人':'Ta还没有关注任何人'"></NoData>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import User from './User.vue'
import NoData from './NoData.vue'
import querystring from 'querystring'
export default{
  components: {
    LoadMore,
    User,
    NoData
  },
  data () {
    return {
      allLoaded: false,
      loading: false,
      noData: false,
      pageSize: 20,
      follows: []
    }
  },
  computed: {
    isUser () {
      let user = querystring.parse(localStorage.getItem('user'))
      let userId = user.id
      if (userId && userId === this.$route.params.id) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getFollows (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`friend/listAttion.do`, {
          params: {
            pageSize: this.pageSize,
            pageNo: pageNo,
            userId: this.$route.params.id
          }
        }).then((response) => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    },
    refresh (loadmore) {
      this.loading = false
      this.allLoaded = false
      this.noData = false
      this.getFollows(1).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.follows = result.data
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
              this.loading = true
            }
          } else {
            this.noData = true
            this.allLoaded = true
          }
        }
        loadmore && loadmore.onTopLoaded()
      })
    },
    loadmore () {
      this.loading = true
      let pageNo = this.follows.length / this.pageSize + 1
      this.getFollows(pageNo).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.follows = pageNo === 1 ? result.data : this.follows.concat(result.data)
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
    }
  }
}
</script>
