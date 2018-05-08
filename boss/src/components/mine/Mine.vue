<template>
  <div class="mine">
    <div class="options">
      <router-link to="/edit"><img src="../../assets/img/mine/icon-edit.png" alt=""></router-link>
      <!--<router-link to="/myNotices" class="notice"><img src="../../assets/img/mine/icon-notice.png" alt=""></router-link>-->
    </div>
    <div class="header">
      <div class="user-info" @click="doLogin">
        <div class="intro">
          <h3 class="name">{{userInfo.name || '登录'}}</h3>
          <span class="company">{{userInfo.company || '立即登录，遇见更好的自己'}}</span>
          <span class="title" v-if="userInfo.title">{{userInfo.title}}</span>
        </div>
        <div class="avatar" @click.stop="toPersonal">
          <img :src="userInfo.avatar ? $root.imgBaseurl + userInfo.avatar : require('../../assets/img/mine/icon-avatar.png')" alt="">
        </div>
      </div>
      <template v-if="userInfo.id">
        <ul class="logined">
          <li v-for="type in userInfo.userTypes"
              :key="type.typeId"
              :class="{selected: selected.typeId===type.typeId}"
              @click="selected=type">
            <img :src="type.userId ? type.typeIconLight : type.typeIcon" alt="">
          </li>
        </ul>
        <div class="selected-info" v-show="selected.userId">
          <div class="flex">
            <span>{{selected.typeName + selected.schoolName + selected.banjiName}}</span>
            <span class="level" v-show="selected.lifeLongStudy">终身复训学员</span>
          </div>
          <div class="deadline">有效期至 {{selected.endTime | dateformat('yyyy/mm/dd')}}</div>
        </div>
      </template>
      <template v-else>
        <ul>
          <li><img src="../../assets/img/mine/icon-emba.png" alt=""></li>
          <li><img src="../../assets/img/mine/icon-fdba.png" alt=""></li>
          <li><img src="../../assets/img/mine/icon-pe.png" alt=""></li>
        </ul>
      </template>
    </div>
    <div class="cells">
      <mt-cell title="开通学员特权" is-link to="/viptarget">
        <img slot="icon" src="../../assets/img/mine/icon-privilege.png">
      </mt-cell>
      <mt-cell title="我报名的课程" is-link @click.native="to('/selectedCourses')">
        <img slot="icon" src="../../assets/img/mine/icon-signup.png">
      </mt-cell>
      <mt-cell title="我的动态" is-link @click.native="to('/dynamics')">
        <img slot="icon" src="../../assets/img/mine/icon-dynamic.png">
      </mt-cell>
      <mt-cell title="我的收藏" is-link @click.native="to('/collects')">
        <img slot="icon" src="../../assets/img/mine/icon-collect.png">
      </mt-cell>
      <mt-cell title="观看历史" is-link @click.native="to('/records')">
        <img slot="icon" src="../../assets/img/mine/icon-history.png">
      </mt-cell>
      <mt-cell title="设置" is-link to="/setting">
        <img slot="icon" src="../../assets/img/mine/icon-setting.png">
      </mt-cell>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import querystring from 'querystring'
export default {
  data () {
    return {
      userInfo: {},
      selected: {},
      userId: querystring.parse(localStorage.getItem('user')).id
    }
  },
  mounted () {
    if (this.userId) {
      this.getUserInfo()
    } else {
      this.$nextTick(() => {
        this.indicator.close()
      })
    }
  },
  methods: {
    getUserInfo () {
      this.axios.get(`/user/userInfo.do`, {
        params: {
          userId: this.userId
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.userInfo = result.data
          this.selected = this.userInfo.userTypes[0] || {}
        }
        this.indicator.close()
      })
    },
    doLogin () {
      if (!this.userInfo.id) {
        this.$router.push('/login')
      }
    },
    toPersonal () {
      let id = this.userInfo.id
      if (id) {
        this.$router.push(`/personal/${id}`)
      }
    },
    to (url) {
      let id = this.userInfo.id
      if (!id) {
        this.messageBox.alert('您还没有登录，请先登录').then(action => {
          if (action === 'confirm') {
            this.$router.push('/login')
          }
        })
      } else {
        this.$router.push(url)
      }
    }
  }
}
</script>
<style lang="less">
  .mine{
    padding-bottom: .5rem;
    .options{
      padding: .2rem 0.075rem .25rem;
      & > a{
        border: .075rem solid transparent;
        box-sizing: content-box;
      }
      .notice{
        &::after{
          content: '';
          width: .05rem;
          height: .05rem;
          position: absolute;
          margin-left: 2px;
          background:#f83b3b;
          border-radius: 50%;
        }
      }
      img{
        height: .16rem;
      }
    }
    .header{
      padding: 0 .15rem;
      ul{
        overflow: hidden;
        position: relative;
        &.logined::after{
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          border-top: 1px solid #e0e0e0;
          background: #e0e0e0;
          transform: scaleY(0.5);
        }
        & > li {
          float: left;
          width: .22rem;
          border-top: .15rem solid;
          border-bottom: .1rem solid;
          border-right: .12rem solid;
          border-color: transparent;
          box-sizing: content-box;
          position: relative;
          &.selected{
            &::after{
              content: '';
              width: .08rem;
              height: .08rem;
              position: absolute;
              bottom: -.14rem;
              left: calc(50% - .035rem);
              transform: rotate(45deg);
              background: #ffffff;
              border: 1px solid #e0e0e0;
              z-index: 1;
            }
          }
        }
        img{
          width: 100%;
        }
      }
    }
    .user-info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name{
        margin-bottom: .07rem;
        font-size: .24rem;
      }
      .company, .title{
        font-size: .13rem;
      }
      .avatar{
        flex: 0 0 .7rem;
        width: .7rem;
        height: .7rem;
        & > img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .selected-info{
      padding: .1rem 0;
      color: #666;
      .flex{
        display: flex;
        justify-content: space-between;
      }
      .level{
        font-size: .13rem;
        color:#cca873;
      }
      .deadline{
        margin-top: 7px;
        font-size: .12rem;
        color: #999;
      }
    }
    .cells{
      margin: .3rem .1rem;
      .mint-cell{
        &:last-child{
          background-image: none;
        }
      }
      .mint-cell-wrapper{
        background-image: none;
      }
    }
  }
</style>
