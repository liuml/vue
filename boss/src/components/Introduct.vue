<template>
  <div class="introduct">
    <p class="content" :class="{open: open}" v-html="html"></p>
    <span class="toggle" @click="open=!open">{{!open?'详细介绍':'收起介绍'}}</span>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: ['html'],
  data () {
    return {
      open: false
    }
  }
}
</script>
<style lang="less" scoped>
  .introduct{
    padding: 0 .15rem;
    text-align: center;
    .content{
      text-align: left;
      font-size: .15rem;
      color: #666;
      line-height: .25rem;
      max-height: 3.5rem;
      overflow: hidden;
      transition: max-height .3s;
      &.open{
        max-height: 9rem;
      }
    }
    .toggle{
      float: right;
      font-size: .15rem;
      color:#cca873;
      line-height: .25rem;
    }
  }
</style>
