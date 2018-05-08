<template>
  <div class="set-password">
    <mt-header title="设置密码">
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
    </mt-header>
    <div class="content">
      <div class="cells">
        <mt-field placeholder="手机号" type="tel" v-model="phone" readonly></mt-field>
        <mt-field placeholder="验证码" type="tel" v-model="captcha">
          <Captcha :phone="phone"></Captcha>
        </mt-field>
        <mt-field placeholder="新密码" :type="passwordVisible?'text':'password'" v-model="password">
          <mt-button type="default" class="visible-btn" @click="passwordVisible=!passwordVisible">
            <img :src="passwordVisible?require('../../assets/img/account/icon-pass-visible.png'): require('../../assets/img/account/icon-pass-hidden.png')" alt="">
          </mt-button>
        </mt-field>
      </div>
      <mt-button type="primary" size="large" @click.native="setPwd">确定</mt-button>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Captcha from '../Captcha.vue'
import querystring from 'querystring'
export default{
  components: {
    Captcha
  },
  data () {
    return {
      phone: querystring.parse(localStorage.getItem('user')).phone,
      captcha: '',
      password: '',
      passwordVisible: false
    }
  },
  created () {
    this.$nextTick(() => {
      this.indicator.close()
    })
    let user = localStorage.getItem('user')
    if (!user) {
      // 用户没有登录
      this.messageBox.alert('您还没有登录，请先登录').then(action => {
        if (action === 'confirm') {
          this.$router.push('/login')
        }
      })
    }
  },
  methods: {
    setPwd () {
      if (!this.captcha) {
        this.toast({
          message: '请输入验证码',
          duration: 1000
        })
        return
      }
      if (!this.password) {
        this.toast({
          message: '请输入新密码',
          duration: 1000
        })
        return
      }
      this.doSetPwd()
    },
    doSetPwd () {
      this.axios.post(`user/userSetPwd.do`, querystring.stringify({
        phone: this.phone,
        code: this.captcha,
        pwd: this.password
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.toast({
            message: '设置成功',
            duration: 1000
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
  .set-password{
    .content{
      padding: 0 .3rem;
      .cells{
        margin-top: .3rem;
        margin-bottom: .5rem;
        .mint-cell-wrapper{
          padding: 0 !important;
        }
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
      padding: 0;
      padding-left: .1rem;
      img{
        width: .2rem !important;
        margin-right: 0 !important;
      }
    }
  }
</style>
