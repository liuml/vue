<template>
  <div class="setting">
    <mt-header title="设置">
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <div class="cells">
      <mt-cell title="设置密码" is-link to="/setPassword"></mt-cell>
    </div>
    <div class="cells">
      <mt-cell title="用户服务协议" is-link @click.native="$root.toLink('userServiceProtocolUrl')"></mt-cell>
      <mt-cell title="用户最终许可协议" is-link @click.native="$root.toLink('userFinalLicenseAgreementUrl')"></mt-cell>
      <mt-cell title="服务条款" is-link @click.native="$root.toLink('serviceTermsUrl')"></mt-cell>
    </div>
    <div class="login-out" @click="loginOut">退出登录</div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  mounted () {
    this.$nextTick(() => {
      this.indicator.close()
    })
  },
  methods: {
    loginOut () {
      this.messageBox.confirm('确定要退出登录？', '退出登录').then(action => {
        if (action === 'confirm') {
          localStorage.removeItem('user')
          this.$router.replace('/mine')
        }
      }, cancel => {})
    }
  }
}
</script>
<style lang="less" scoped>
.setting{
  height: 100vh;
  background:#f9f9f9;
  .cells{
    margin: .15rem 0;
  }
  .login-out{
    line-height: .5rem;
    text-align: center;
    background: #ffffff;
    color: #cca873;
  }
}
</style>
