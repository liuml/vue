<template>
  <div class="container">
    <mt-header title="图文直播" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <LoadMore allLoaded @on-refresh="refresh">
      <Live v-for="live in lives" :live="live" :key="live.id"></Live>
    </LoadMore>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import Live from './Live.vue'
export default{
  components: {
    LoadMore,
    Live
  },
  data () {
    return {
      lives: []
    }
  },
  created () {
    this.getLives()
  },
  methods: {
    refresh (loadmore) {
      this.getLives(loadmore)
    },
    getLives (loadmore) {
      this.axios.get(`businesscourse/teletext.do`, {
        params: {
          id: this.$route.params.id
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.lives = result.data.teletexts
          this.indicator.close()
          loadmore && loadmore.onTopLoaded()
        }
      })
    }
  }
}
</script>
