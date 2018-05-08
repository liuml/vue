<template>
  <div class="keywords-container">
    <h3 class="title">热门搜索</h3>
    <ul class="keywords">
      <li v-for="(keyword, index) in list" :key="index" class="keyword" @click="$emit('search', keyword)">{{keyword}}</li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: {
    list: Array
  }
}
</script>
<style lang="less" scoped>
.keywords-container{
  margin-top: .3rem;
  .title{
    font-size: .17rem;
  }
  .keywords{
    margin-right: -.15rem;
    .keyword{
      display: inline-block;
      white-space: nowrap;
      padding: 6px 15px;
      margin: .15rem .15rem 0 0;
      background: #f0f0f0;
      border-radius:2px;
      font-size: .15rem;
      color: #666;
      &:active{
        background: #AEAEAE;
      }
    }
  }
}
</style>
