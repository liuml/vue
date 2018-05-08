<template>
  <div class="container">
    <mt-header title="选座用户" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :allLoaded="allLoaded" :loading="loading" @on-refresh="refresh" @on-loadmore="loadmore">
      <ul class="follows" v-if="users.length">
        <li is="User" v-for="user in users" :key="user.id" :user="user" @unFollowed="refresh"></li>
      </ul>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import User from '../personal/User.vue'
export default{
  components: {
    LoadMore,
    User
  },
  data () {
    return {
      allLoaded: false,
      loading: false,
      pageSize: 20,
      users: []
    }
  },
  methods: {
    getUsers (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`businesscourse/bcUsers.do`, {
          params: {
            pageSize: this.pageSize,
            pageNo: pageNo,
            id: this.$route.params.id
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
      this.getUsers(1).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.users = result.data
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
              this.loading = true
            }
          } else {
            this.allLoaded = true
          }
        }
        loadmore && loadmore.onTopLoaded()
      })
    },
    loadmore () {
      this.loading = true
      let pageNo = this.users.length / this.pageSize + 1
      this.getUsers(pageNo).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            this.users = pageNo === 1 ? result.data : this.users.concat(result.data)
            if (result.data.length < this.pageSize) {
              this.allLoaded = true
            } else {
              this.loading = false
            }
          } else {
            this.allLoaded = true
          }
        }
      })
    }
  }
}
</script>
