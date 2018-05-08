<template>
  <div id="app">
    <router-view/>
    <mt-tabbar v-model="selected" fixed v-if="showTabbar">
      <mt-tab-item id="business" data-url="/business" @click.native="changeTabbar">
        <img slot="icon" :src="selected=='business'?require('./assets/img/index/icon-business-active.png'):require('./assets/img/index/icon-business.png')">商学
      </mt-tab-item>
      <mt-tab-item id="dynamic" data-url="/dynamic" @click.native="changeTabbar">
        <img slot="icon" :src="selected=='dynamic'?require('./assets/img/index/icon-dynamic-active.png'):require('./assets/img/index/icon-dynamic.png')">BOSS圈
      </mt-tab-item>
      <mt-tab-item id="mine" data-url="/mine" @click.native="changeTabbar">
        <img slot="icon" :src="selected=='mine'?require('./assets/img/index/icon-mine-active.png'):require('./assets/img/index/icon-mine.png')">我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data () {
    return {
      selected: this.$route.name
    }
  },
  computed: {
    showTabbar () {
      return this.$store.state.showTabbar
    }
  },
  watch: {
    '$route' (to) {
      this.selected = to.name
    }
  },
  methods: {
    changeTabbar (event) {
      this.$router.replace(event.currentTarget.dataset.url)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
