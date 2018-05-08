<template>
  <div class="container">
    <mt-header title="我的动态" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore :allLoaded="allLoaded" :loading="loading" @on-refresh="refresh" @on-loadmore="loadmore">
      <ul class="my-dynamics" v-if="dynamics.length">
        <li is="Dynamic" v-for="dynamic in dynamics" :key="dynamic.id" :dynamic="dynamic"></li>
      </ul>
      <NoDynamic v-if="noData"></NoDynamic>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
  import LoadMore from '../LoadMore.vue'
  import NoDynamic from '../dynamic/NoDynamic.vue'
  import Dynamic from '../dynamic/Dynamic.vue'
  import querystring from 'querystring'
  export default{
    components: {
      LoadMore,
      NoDynamic,
      Dynamic
    },
    data () {
      return {
        allLoaded: false,
        loading: false,
        noData: false,
        pageSize: 10,
        dynamics: []
      }
    },
    methods: {
      getDynamics (pageNo) {
        return new Promise((resolve) => {
          this.axios.get(`dynamic/list.do`, {
            params: {
              pageSize: this.pageSize,
              pageNo: pageNo,
              type: 1,
              typeId: querystring.parse(localStorage.getItem('user')).id
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
        this.getDynamics(1).then(result => {
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
          }
          loadmore && loadmore.onTopLoaded()
        })
      },
      loadmore () {
        this.loading = true
        let pageNo = this.dynamics.length / this.pageSize + 1
        this.getDynamics(pageNo).then(result => {
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
      }
    }
  }
</script>
<style lang="less" scoped>
  .my-dynamics{
    padding: 0 .15rem;
  }
</style>
