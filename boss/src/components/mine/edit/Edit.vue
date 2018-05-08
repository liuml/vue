<template>
  <div class="edit-info">
    <mt-header title="编辑个人资料">
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
      <mt-button slot="right" @click.native="saveUpdate">保存</mt-button>
    </mt-header>
    <div class="upload-avatar">
      <UploadImg :url="avatar" @generate="generate"></UploadImg>
    </div>
    <div class="form">
      <mt-field label="姓名" placeholder="必填" v-model="username"></mt-field>
      <mt-field label="性别" class="sex-field">
        <Radio :options="options" v-model="sex"></Radio>
      </mt-field>
      <mt-cell title="行业" :label="`${industry} ${title}`||'请选择'" :class="{label: industry}" is-link @click.native="industryPopup=true"></mt-cell>
      <mt-field label="公司" placeholder="必填" v-model="company"></mt-field>
      <mt-cell title="城市" :label="`${province} ${city}`||'请选择'"  :class="{label: province}" is-link @click.native="cityPopup=true"></mt-cell>
    </div>
    <Picker :show.sync="industryPopup" :slots="industrySlots" @change="industryChange" @confirm="industryConfirm" @cancel="industryPopup=false"></Picker>
    <Picker :show.sync="cityPopup" :slots="citySlots" @change="cityChange" @confirm="cityConfirm" @cancel="cityPopup=false"></Picker>
  </div>
</template>
<script type="text/ecmascript-6">
import UploadImg from './UploadImg.vue'
import Radio from './Radio.vue'
import Picker from './Picker.vue'
import querystring from 'querystring'
export default {
  components: {
    UploadImg,
    Radio,
    Picker
  },
  data () {
    return {
      userInfo: {},
      avatar: '',
      // 用户新上传的头像
      base64Url: '',
      username: '',
      sex: '1',
      industry: '',
      title: '',
      province: '',
      city: '',
      company: '',
      options: [{value: '0', label: '保密'}, {value: '1', label: '男'}, {value: '2', label: '女'}],
      // 控制行业和城市两个picker的一些数据：
      industryPopup: false,
      cityPopup: false,
      cityObj: {},
      industryObj: {},
      industrySlot1Index: 0,
      industrySlot2Index: 0,
      citySlot1Index: 0,
      citySlot2Index: 0
    }
  },
  computed: {
    industrySlots () {
      return [
        {
          flex: 1,
          values: Object.keys(this.industryObj),
          defaultIndex: this.industrySlot1Index
        }, {
          flex: 1,
          values: this.userInfo.industry ? this.industryObj[this.userInfo.industry] : [],
          defaultIndex: this.industrySlot2Index
        }
      ]
    },
    citySlots () {
      return [
        {
          flex: 1,
          values: Object.keys(this.cityObj),
          defaultIndex: this.citySlot1Index
        }, {
          flex: 1,
          values: this.userInfo.province ? this.cityObj[this.userInfo.province] : [],
          defaultIndex: this.citySlot2Index
        }
      ]
    }
  },
  created () {
    // 判断是否登录
    let user = querystring.parse(localStorage.getItem('user'))
    if (!user.id) {
      this.messageBox.alert('您还没有登录，请先登录').then(action => {
        if (action === 'confirm') {
          this.$router.push('/login')
        }
      })
    } else {
      this.getUserInfo(user.id).then((userinfo) => {
        this.userInfo = userinfo
        this.setData(userinfo)
        this.getCitys()
        this.getIndustry()
        this.indicator.close()
      })
    }
  },
  methods: {
    generate (base64Url) {
      this.avatar = base64Url
      this.base64Url = base64Url
    },
    industryChange (picker, values) {
      picker.setSlotValues(1, this.industryObj[values[0]])
    },
    cityChange (picker, values) {
      picker.setSlotValues(1, this.cityObj[values[0]])
    },
    industryConfirm (values) {
      this.industry = values[0]
      this.title = values[1]
      this.industryPopup = false
    },
    cityConfirm (values) {
      this.province = values[0]
      this.city = values[1]
      this.cityPopup = false
    },
    setData (userInfo) {
      this.avatar = this.$root.imgBaseurl + userInfo.avatar
      this.username = userInfo.name
      this.sex = userInfo.gender.toString()
      this.industry = userInfo.industry
      this.title = userInfo.title
      this.company = userInfo.company
      this.province = userInfo.province
      this.city = userInfo.city
    },
    getUserInfo (userId) {
      return new Promise(resolve => {
        this.axios.get(`user/userInfo.do`, {
          params: {
            userId: userId
          }
        }).then(response => {
          let result = response.data
          if (result.success) {
            resolve(result.data)
          }
        })
      })
    },
    getCitys () {
      this.axios.get(`public/citys.do`)
        .then(response => {
          let result = response.data
          if (result.success && result.data) {
            let res = this.dataToObj(result.data, this.userInfo.province, this.userInfo.city)
            this.cityObj = res.obj
            this.citySlot1Index = res.slot1Index
            this.citySlot2Index = res.slot2Index
          }
        })
    },
    getIndustry () {
      this.axios.get(`public/industry.do`)
        .then(response => {
          let result = response.data
          if (result.success && result.data) {
            let res = this.dataToObj(result.data, this.userInfo.industry, this.userInfo.title)
            this.industryObj = res.obj
            this.industrySlot1Index = res.slot1Index
            this.industrySlot2Index = res.slot2Index
          }
        })
    },
    saveUpdate () {
      this.indicator.open()
      this.axios.post(`user/updateUser.do`, querystring.stringify({
        imageBase64Data: this.base64Url && this.base64Url.replace(/^data:image\/(jpeg|png|gif|jpg);base64,/, ''),
        companyName: this.company,
        title: this.title,
        province: this.province,
        city: this.city,
        industry: this.industry,
        gender: parseInt(this.sex)
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.indicator.close()
          this.toast({
            message: '保存成功',
            duration: 1000
          })
          this.userInfo = result.data
        }
      })
    },
    dataToObj (data, slot1Value, slot2Value) {
      let subs = []
      let obj = {}
      let [slot1Index, slot2Index] = [0, 0]
      JSON.parse(data).map(function (item, index) {
        if (index === 0) {
          return
        }
        if (slot1Value && item.name === slot1Value) {
          slot1Index = index
        }
        subs = item.sub.map((subitem, i) => {
          if (slot1Value && slot2Value && item.name === slot1Value && subitem.name === slot2Value) {
            slot2Index = i
          }
          return subitem.name
        })
        obj[item.name] = subs
      })
      return {
        obj: obj,
        slot1Index: --slot1Index,
        slot2Index: slot2Index
      }
    }
  }
}
</script>
<style lang="less">
  .edit-info{
    background: #f9f9f9;
    .upload-avatar{
      background: #ffffff;
      padding: .32rem 0;
      box-sizing: content-box;
    }
    .sex-field{
      .mint-field-core{
        display: none;
      }
    }
    .form{
      margin: .15rem 0;
      color: #999;
    }
    .radio-list-label + .radio-list-label{
      margin-left: .3rem;
    }
    //  field
    .mint-field{
      .mint-cell-title{
        width: .76rem;
      }
    }
    // cell
    .mint-cell-text{
      display: inline-block;
      width: .7rem;
    }
    .mint-cell.label{
      .mint-cell-label{
        color: #333;
      }
    }
  }
</style>
