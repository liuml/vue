<template>
  <div class="no-login">
    <img src="../../assets/img/dynamic/no-login.png" alt="">
    <div class="label">登录之后发现更多</div>
    <mt-button type="primary" size="large" @click.native="$router.push('/login')">立即登录</mt-button>
  </div>
</template>
<script type="text/ecmascript-6">

</script>
<style lang="less" scoped>
  .no-login{
    width: 1.8rem;
    margin: .6rem auto 0;
    text-align: center;
    img{
      width: 1.2rem;
    }
    .label{
      margin: .2rem 0 .4rem;
      font-size: .14rem;
      color: #999;
    }
  }
</style>
