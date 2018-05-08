<template>
  <div class="login">
    <mt-header>
      <router-link to="/regist" slot="right">注册</router-link>
    </mt-header>
    <div class="content">
      <h3 class="title">{{loginType?'验证码登录':'密码登录'}}</h3>
      <div class="cells">
        <mt-field placeholder="手机号" type="tel" v-model.trim="phone"></mt-field>
        <mt-field placeholder="4位验证码" type="tel" v-model.trim="captcha" v-if="loginType">
          <Captcha :phone="phone"></Captcha>
        </mt-field>
        <mt-field placeholder="密码" :type="passwordVisible?'text':'password'" v-model.trim="password" v-if="!loginType">
          <mt-button type="default" class="visible-btn" @click="passwordVisible=!passwordVisible">
            <img :src="passwordVisible?require('../assets/img/account/icon-pass-visible.png'): require('../assets/img/account/icon-pass-hidden.png')" alt="">
          </mt-button>
        </mt-field>
      </div>
      <mt-button type="primary" size="large" @click.native="login">登录</mt-button>
    </div>
    <ul class="login-types">
      <!--<li class="item" v-if="$root.isWeixin">
        <img src="../assets/img/account/icon-wechat.png" alt="">
        <span class="label">微信登录</span>
      </li>-->
      <li class="item" v-show="loginType" @click="loginType=0">
        <img src="../assets/img/account/icon-password.png" alt="">
        <span class="label">密码登录</span>
      </li>
      <li class="item"  v-show="!loginType" @click="loginType=1">
        <img src="../assets/img/account/icon-captcha.png" alt="">
        <span class="label">验证码登录</span>
      </li>
    </ul>
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
      password: '',
      captcha: '',
      // 0代表密码登录，1代表验证码登录
      loginType: 0,
      // 密码是否可见
      passwordVisible: false,
      fromPath: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('updateLoginFrom', from.fullPath)
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.indicator.close()
    })
  },
  methods: {
    login () {
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
      if (this.loginType) {
        // 验证码不能为空
        if (!this.captcha) {
          this.toast({
            message: '请输入验证码',
            duration: 1000
          })
          return
        }
        this.codeLogin()
      } else {
        // 密码不能为空
        if (!this.password) {
          this.toast({
            message: '请输入密码',
            duration: 1000
          })
          return
        }
        this.pwdLogin()
      }
    },
    pwdLogin () {
      this.axios.post(`user/pwdLogin.do`, querystring.stringify({
        phone: this.phone,
        pwd: this.password
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.loginSuccess(result.data)
        }
      })
    },
    codeLogin () {
      this.axios.post(`user/codeLogin.do`, querystring.stringify({
        phone: this.phone,
        code: this.captcha
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.loginSuccess(result.data)
        }
      })
    },
    loginSuccess (user) {
      localStorage.setItem('user', querystring.stringify(user))
      this.indicator.close()
      if (this.fromPath) {
        this.$router.replace(this.fromPath)
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
<style lang="less">
  .login{
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
    .visible-btn{
      height: 2em !important;
      line-height: 1em !important;
      padding: 0;
      font-size: .15rem !important;
      background: none;
      box-shadow: none;
      color: #cca873;
      img{
        width: .2rem !important;
        margin-right: 0 !important;
      }
    }
    .login-types{
      margin-top: 1.4rem;
      text-align: center;
      .item{
        display: inline-block;
        margin: 0 .125rem;
        & > img{
          width: .5rem;
          height: .5rem;
        }
        & > .label{
          display: block;
          margin-top: .1rem;
          font-size: .13rem;
          color: #666;
        }
      }
    }
  }
</style>
