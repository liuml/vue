<template>
  <div class="dynamic">
    <Header :info="dynamicInfo"></Header>
    <div class="main">
      <p class="content">{{dynamicInfo.dynamicContent}}</p>
      <div class="clearfix">
        <span @click="toDynamicDetail" class="all">查看全部</span>
      </div>
      <ImagePreview :imgs="dynamicInfo.dynamicImageUris" v-if="dynamicInfo.dynamicImageUris && dynamicInfo.dynamicImageUris.length"></ImagePreview>
      <Option :data="dynamicInfo" @toggle-like="toggleLike" @onComment="toDynamicDetail"></Option>
      <div class="comment-detail" v-if="dynamicInfo.likes.length||dynamicInfo.comments.length">
        <ul class="zans" v-if="dynamicInfo.likes.length">
          <li class="username" v-for="(zan,index) in dynamicInfo.likes" :key="index" v-if="index < 3">{{zan.name}}</li>
          <li v-if="dynamicInfo.likes.length > 3">&nbsp;等{{dynamicInfo.likes.length}}人点赞</li>
        </ul>
        <ul class="comments" v-if="dynamicInfo.comments.length">
          <li v-for="(comment,index) in dynamicInfo.comments" :key="index" v-if="index < 5">
            <template v-if="!comment.toUserName">
              <span class="username">{{comment.userName}}：</span>{{comment.content}}
            </template>
            <template v-else>
              <span class="username">{{comment.userName}}</span>{{comment.customTitle}}<span class="username">{{comment.toUserName}}</span>：{{comment.content}}
            </template>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import Header from './Header.vue'
import ImagePreview from '../ImagePreview.vue'
import Option from './Option.vue'
import querystring from 'querystring'
export default {
  components: {
    Header,
    ImagePreview,
    Option
  },
  props: ['dynamic'],
  data () {
    return {
      dynamicInfo: this.dynamic
    }
  },
  methods: {
    toggleLike () {
      this.axios.post(`dynamic/like.do`, querystring.stringify({
        dynamicId: this.dynamicInfo.id
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.dynamicInfo = result.data
        }
      })
    },
    toDynamicDetail () {
      if (this.$root.isAndroid) {
        window.BossAndroid.bsxOpenDynamciDetail(this.dynamicInfo.id)
      } else if (this.$root.isIOS) {
        window.webkit.messageHandlers.bsxOpenDynamciDetail.postMessage({id: this.dynamicInfo.id})
      } else {
        this.$router.push(`/dynamicDetail/${this.dynamicInfo.id}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .line{
    position: relative;
    &::after{
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #e4e4e4;
      transform: scaleY(0.5);
    }
  }
  .dynamic{
    padding-top: .3rem;
    overflow: hidden;
    &:not(:last-of-type){
      .main{
        .line
      }
    }
    .main{
      margin-left: .46rem;
      padding-bottom: .3rem;
      .content{
        margin-top: .15rem;
        padding: 0;
        line-height: .22rem;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
      }
      .all{
        float: right;
        margin: .08rem 0 .2rem;
        font-size: .14rem;
        color:#cca873;
      }
      .comment-detail{
        position: relative;
        background: #f7f7f7;
        color: #666;
        font-size: .13rem;
        &::before{
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border: .06rem solid transparent;
          border-bottom-color: #f7f7f7;
          top: -.12rem;
          right: .15rem;
        }
      }
      .zans{
        overflow: hidden;
        line-height: .4rem;
        padding: 0 .15rem;
        & > li {
          float: left;
        }
        .username{
          color:#4d7092;
          & + .username {
            &::before{
              content: '，';
            }
          }
        }
        & + .comments{
          .line;
          &::after{
            border-top-color: #eee;
            top: 0;
            bottom: auto;
          }
        }
      }
      .comments{
        padding: .1rem .15rem;
        & > li{
          line-height: .22rem;
        }
        .username{
          color:#4d7092;
        }
      }
    }
  }
</style>
