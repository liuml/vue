<template>
  <div class="rich-html" v-html="content"></div>
</template>
<script type="text/ecmascript-6">
export default{
  data () {
    return {
      content: ''
    }
  },
  created () {
    let id = this.$route.params.id
    if (id) {
      this.getHtml(id)
    }
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    this.getHtml(to.params.id)
    next()
  },
  methods: {
    getHtml (id) {
      this.axios.get(`public/richhtmlgetContent.do`, {
        params: {
          id: id
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.content = result.data.content
          this.indicator.close()
        }
      })
    }
  }
}
</script>
<style lang="less">
  .rich-html{
    padding: .15rem;
    font-size: .15rem;
    img{
      max-width: 100%;
      height: auto;
    }
  }
</style>
