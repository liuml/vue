<template>
  <h3 class="title">
    <i class="icon-left"></i>
    <span class="name">{{name}}</span>
    <i class="icon-right"></i>
  </h3>
</template>
<script type="text/ecmascript-6">
export default{
  props: ['name']
}
</script>
<style lang="less" scoped>
.title{
  margin: .5rem 0 .4rem;
  font-size: .17rem;
  text-align: center;
  display: flex;
  .icon{
    flex: 1;
    display: block;
    height: .22rem;
    background-size: 100% auto;
    background-position: right;
    background-repeat: no-repeat;
  }
  .name{
    margin: 0 .14rem;
  }
  .icon-left{
    .icon;
    background-image: url(../../assets/img/branch/icon-title-left.png);
  }
  .icon-right{
    .icon;
    background-image: url(../../assets/img/branch/icon-title-right.png);
  }
}
</style>
