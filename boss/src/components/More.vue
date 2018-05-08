<template>
  <router-link :to="url" class="more">{{label}} <i class="icon-more"></i></router-link>
</template>
<script type="text/ecmascript-6">
export default {
  props: ['url', 'label']
}
</script>
<style lang="less" scoped>
  .more{
    font-size: .13rem;
    color: #999;
    vertical-align: middle;
    font-weight: initial;
    .icon-more{
      height: .1rem;
      width: .07rem;
      display: inline-block;
      background-image: url("../assets/img/business/icon-more.png");
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
</style>
