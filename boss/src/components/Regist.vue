<template>
  <div class="regist">
    <mt-header>
      <router-link to="/login" slot="right">去登录</router-link>
    </mt-header>
    <div class="content">
      <h3 class="title">注册</h3>
      <div class="cells">
        <mt-field placeholder="手机号" type="tel" v-model.trim="phone"></mt-field>
        <mt-field placeholder="验证码" type="tel" v-model.trim="captcha">
          <Captcha :phone="phone"></Captcha>
        </mt-field>
      </div>
      <mt-button type="primary" size="large" @click.native="register">注册</mt-button>
    </div>
    <span @click="$root.toLink('userServiceProtocolUrl')" class="deal">《用户服务协议》</span>
  </div>
</template>
<script type="text/ecmascript-6">
import Captcha from './Captcha.vue'
import querystring from 'querystring'
export default {
  components: {
    Captcha
  },
  data () {
    return {
      phone: '',
      captcha: '',
      fromPath: this.$store.state.loginFromPath
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.indicator.close()
    })
  },
  methods: {
    register () {
      if (!this.phone) {
        this.toast({
          message: '请输入手机号',
          duration: 1000
        })
        return
      } else if (!(/^1[34578]\d{9}$/.test(this.phone))) {
        this.toast({
          message: '手机号格式不正确',
          duration: 1000
        })
        return
      }
      if (!this.captcha) {
        this.toast({
          message: '请输入验证码',
          duration: 1000
        })
        return
      }
      this.doRegister()
    },
    doRegister () {
      this.indicator.open('注册中...')
      this.axios.post(`user/register.do`, querystring.stringify({
        phone: this.phone,
        code: this.captcha
      }))
        .then(response => {
          let result = response.data
          if (result.success) {
            this.saveUser(result.data)
            this.indicator.close()
            this.$router.replace(this.fromPath)
          }
        })
    },
    saveUser (user) {
      localStorage.setItem('user', querystring.stringify(user))
    }
  }
}
</script>
<style lang="less">
  .regist{
    text-align: center;
    .title{
      text-align: center;
      font-size: .22rem;
      font-weight: 400;
    }
    .content{
      padding: .22rem .48rem;
      .cells{
        margin: .4rem 0 .5rem;
      }
    }
    .mint-field{
      min-height: .6rem !important;
      .mint-cell-wrapper{
        padding: 0 !important;
      }
    }
    .deal{
      display: inline-block;
      margin-top: 2rem;
      font-size: .13rem;
    }
  }
</style>
