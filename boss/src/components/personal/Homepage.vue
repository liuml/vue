<template>
  <div class="personal">
    <LoadMore :loading="loading" :allLoaded="allLoaded" @on-refresh="refresh" @on-loadmore="loadmore">
      <Info :data="userInfo" @unFollowed="getUserInfo(id)" @Followed="getUserInfo(id)"></Info>
      <ul class="dynamics" v-if="dynamics.length">
        <li is="Dynamic" v-for="dynamic in dynamics" :key="dynamic.id" :dynamic="dynamic"></li>
      </ul>
      <NoDynamic v-if="noData"></NoDynamic>
      <div class="no-more" v-if="!noData && allLoaded">暂无更多</div>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import Info from './Info.vue'
import Dynamic from './Dynamic.vue'
import NoDynamic from '../dynamic/NoDynamic.vue'
export default {
  components: {
    LoadMore,
    Info,
    Dynamic,
    NoDynamic
  },
  data () {
    return {
      id: this.$route.params.id,
      userInfo: {},
      dynamics: [],
      pageSize: 10,
      loading: false,
      allLoaded: false,
      noData: false
    }
  },
  created () {
    this.getUserInfo(this.id)
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
          this.userInfo = result.data
          this.indicator.close()
        }
      })
    },
    refresh (loadmore) {
      this.getUserInfo(this.id)
      this.loading = false
      this.allLoaded = false
      this.noData = false
      this.getDynamics(1).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            let resultArray = this.filterResult(result.data)
            this.dynamics = resultArray
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
      let pageNo = this.dynamics.length / this.pageSize + 1
      this.getDynamics(pageNo).then(result => {
        if (result.success) {
          if (result.data && result.data.length) {
            let resultArray = this.filterResult(result.data)
            this.dynamics = pageNo === 1 ? resultArray : this.dynamics.concat(resultArray)
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
    compare (value1, value2) {
      if (value1.dynamicCreateTime > value2.dynamicCreateTime) {
        return -1
      } else if (value1.dynamicCreateTime < value2.dynamicCreateTime) {
        return 1
      } else {
        return 0
      }
    },
    filterResult (data) {
      let resultArray = []
      data.sort(this.compare)
      data.forEach((item, index, array) => {
        let pre = null
        if (index > 0) {
          pre = array[index - 1]
        } else if (this.dynamics.length > 0) {
          pre = this.dynamics[this.dynamics.length - 1]
        }
        if (pre && (pre.dynamicCreateTime - item.dynamicCreateTime) < 24 * 60 * 60 * 1000) {
          // 前一项和此项是同一天发布的动态，隐藏此项的时间
          item.visibility = 'hidden'
        }
        resultArray.push(item)
      })
      return resultArray
    },
    getDynamics (pageNo) {
      return new Promise((resolve) => {
        this.axios.get(`dynamic/list.do`, {
          params: {
            pageSize: this.pageSize,
            pageNo: pageNo,
            type: 1,
            typeId: this.id
          }
        }).then((response) => {
          this.indicator.close()
          resolve(response.data)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .no-more{
    display: flex;
    margin: .5rem .15rem;
    font-size: .13rem;
    color: #999;
    &::before, &::after{
      content: '';
      display: inline-block;
      flex: 1;
      height: 1px;
      background: #e4e4e4;
      margin-top: .5em;
    }
    &::before{
      margin-right: .1rem;
    }
    &::after{
      margin-left: .1rem;
    }
  }
  .no-dynamic{
    margin-top: .8rem !important;
  }
</style>
