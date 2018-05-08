<template>
  <div class="container">
    <mt-header :title="isUser?'我的粉丝':'Ta的粉丝'" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :allLoaded="allLoaded" :loading="loading" @on-refresh="refresh" @on-loadmore="loadmore">
      <ul class="fans-list">
        <li is="User" v-for="fans in fanslist" :key="fans.id" :user="fans"></li>
      </ul>
      <NoData v-if="noData" :message="isUser?'您还没有粉丝':'Ta还没有粉丝'"></NoData>
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
      fanslist: []
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
    getFansList (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`friend/listFensi.do`, {
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
      this.getFansList(1).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.fanslist = result.data
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
              this.loading = true
            }
          } else {
            this.noData = true
            this.allLoaded = true
          }
        }
        loadmore.onTopLoaded()
      })
    },
    loadmore () {
      this.loading = true
      let pageNo = this.fanslist.length / this.pageSize + 1
      this.getFansList(pageNo).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.fanslist = pageNo === 1 ? result.data : this.fanslist.concat(result.data)
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
