<template>
  <mt-loadmore :top-method="refresh" @top-status-change="handleTopChange" ref="loadmore">
    <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" infinite-scroll-distance="50">
      <slot></slot>
    </div>
    <div slot="top" class="mint-loadmore-top">
      <span v-show="topStatus !== 'loading'"  class="pulldown-arrow" :class="{ 'rotate': topStatus === 'drop' }"></span>
      <span v-show="topStatus==='pull'">下拉刷新</span>
      <span v-show="topStatus==='drop'">释放加载</span>
      <span v-show="topStatus === 'loading'"><mt-spinner type="fading-circle" color="#666" :size="18"></mt-spinner>加载中...</span>
    </div>
    <div class="page-infinite-loading" v-show="!allLoaded && loading">
      <mt-spinner type="fading-circle" color="#666" :size="18"></mt-spinner>加载中...
    </div>
  </mt-loadmore>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    allLoaded: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      topStatus: ''
    }
  },
  methods: {
    refresh () {
      this.$emit('on-refresh', this.$refs.loadmore)
    },
    loadMore () {
      if (this.loading) {
        return
      }
      this.$emit('on-loadmore', this.$refs.loadmore)
    },
    handleTopChange (status) {
      this.topStatus = status
    }
  }
}
</script>
<style lang="less">
  .rotate {
    transform: rotate(-180deg);
  }
  .mint-loadmore-top{
    span{
      vertical-align: middle;
    }
  }
  .mint-spinner-fading-circle{
    display: inline-block;
    margin-right: .1rem;
  }
  .pulldown-arrow {
    width: .15rem;
    height: .2rem;
    display: inline-block;
    margin-right: .1rem;
    transition: all linear 0.2s;
    background-image: url(../assets/img/loadmore/icon-refresh.png);
    background-size: .15rem .2rem;
  }
  .page-infinite-loading{
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
</style>
