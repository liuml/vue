<template>
  <mt-button type="default" class="captcha-btn" @click.native.stop="getCaptcha" :disabled="startCountDown">
    <span v-show="!startCountDown">{{captchaLabel}}</span>
    <Countdown v-model="time" :start="startCountDown" @on-finish="finish" v-show="startCountDown"></Countdown>
  </mt-button>
</template>
<script type="text/ecmascript-6">
import Countdown from './CountDown.vue'
import querystring from 'querystring'
export default {
  components: {
    Countdown
  },
  props: {
    start: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 60
    },
    phone: {
      type: String
    }
  },
  data () {
    return {
      time: this.count,
      startCountDown: this.start,
      captchaLabel: '获取验证码'
    }
  },
  methods: {
    getCaptcha () {
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
      this.indicator.open()
      this.axios.post(`public/sendSmsCode.do`, querystring.stringify({phone: this.phone}))
        .then(response => {
          if (response.data.success) {
            this.startCountDown = true
            this.indicator.close()
          }
        })
    },
    finish () {
      this.startCountDown = false
      this.time = this.count
      this.captchaLabel = '重新获取'
    }
  }
}
</script>
<style lang="less" scoped>
  .captcha-btn{
    height: 2em !important;
    line-height: 1em !important;
    padding: 0;
    font-size: .15rem !important;
    background: none;
    box-shadow: none;
    color: #cca873;
  }
</style>
