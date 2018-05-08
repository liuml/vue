<template>
  <div class="no-data">
    <img src="../../assets/img/personal/no-user.png">
    <div class="msg">{{message}}</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: ['message']
}
</script>
<style lang="less" scoped>
.no-data{
  margin-top: 50%;
  text-align: center;
  img{
    width: 1.2rem;
  }
  .msg{
    font-size: .14rem;
    color: #999;
  }
}
</style>
