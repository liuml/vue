<template>
  <div v-if="detail.id" class="container">
    <mt-header title="动态详情" fixed>
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)"></mt-button>
      <mt-button icon="more" slot="right" @click.native="deleteDynamic" v-if="isMineDynamic"></mt-button>
    </mt-header>
    <LoadMore allLoaded @on-refresh="refresh">
      <div class="detail">
        <Header :info="detail"></Header>
        <p class="content">{{detail.dynamicContent}}</p>
        <ImagePreview :imgs="detail.dynamicImageUris"
                      v-if="detail.dynamicImageUris && detail.dynamicImageUris.length">
        </ImagePreview>
        <Option :data="detail" @toggle-like="toggleLike"></Option>
        <div class="zan-comment" v-if="detail.likes.length||detail.comments.length">
          <div class="zan-main" v-if="detail.likes.length">
            <i class="icon-zan"></i>
            <ul class="zans">
              <li class="useravatar" v-for="(zan,index) in detail.likes" :key="index" @click="$router.push(`/personal/${zan.id}`)">
                <img :src="$root.imgBaseurl+zan.avatar">
              </li>
            </ul>
          </div>
          <div class="comment-main" v-if="detail.comments.length">
            <i class="icon-comment"></i>
            <ul class="comments">
              <li v-for="(comment,index) in detail.comments" :key="index" class="flex">
                <div class="useravatar" @click="$router.push(`/personal/${comment.userId}`)">
                  <img :src="$root.imgBaseurl+comment.userAvatar">
                </div>
                <div class="comment-content" @click="addComment(comment)">
                  <div class="flex">
                    <span class="username">{{comment.userName}}</span>
                    <span class="date">{{comment.createTime|dynamicDate}}</span>
                  </div>
                  <p class="comment">
                    <template v-if="!comment.toUserName">
                      {{comment.content}}
                </template>
                    <template v-else>
                      {{comment.customTitle}}<span class="username">{{comment.toUserName}}</span>：{{comment.content}}
                </template>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LoadMore>
    <AddForm :comment="comment" :dynamicId="detail.id" @onSendSuccess="onSended"></AddForm>
    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>
<script type="text/ecmascript-6">
import LoadMore from '../LoadMore.vue'
import Header from './Header.vue'
import ImagePreview from '../ImagePreview.vue'
import Option from './Option.vue'
import AddForm from './AddForm.vue'
import querystring from 'querystring'
export default {
  components: {
    LoadMore,
    Header,
    ImagePreview,
    Option,
    AddForm
  },
  data () {
    return {
      detail: {},
      comment: {},
      commentId: -1,
      actions: [],
      sheetVisible: false,
      fromPath: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.fromPath = from.fullPath
    })
  },
  created () {
    let id = this.$route.params.id
    if (id) {
      this.getDetail(id)
    }
  },
  mounted () {
    this.actions = [{
      name: '删除',
      method: this.deleteComment
    }]
  },
  computed: {
    isMineDynamic () {
      let user = localStorage.getItem('user')
      let userId = Number.parseInt(querystring.parse(user).id)
      if (this.detail.userId === userId) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    refresh (loadmore) {
      this.resetData()
      let id = this.$route.params.id
      if (id) {
        this.getDetail(id, loadmore)
      }
    },
    resetData () {
      this.comment = {}
      this.commentId = -1
      this.sheetVisible = false
    },
    getDetail (id, loadmore) {
      this.axios.get(`dynamic/detail.do`, {
        params: {
          id: id
        }
      }).then(response => {
        let result = response.data
        if (result.success) {
          this.detail = result.data
          this.indicator.close()
          loadmore && loadmore.onTopLoaded()
        }
      })
    },
    toggleLike () {
      this.axios.post(`dynamic/like.do`, querystring.stringify({
        dynamicId: this.detail.id
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.detail = result.data
        }
      })
    },
    addComment (comment) {
      let user = localStorage.getItem('user')
      if (!user) {
        this.messageBox.alert('您还没有登录，请先登录').then(action => {
          if (action === 'confirm') {
            this.$router.push('/login')
          }
        })
        return
      }
      let userId = Number.parseInt(querystring.parse(user).id)
      if (userId !== comment.userId) {
        this.comment = comment
      } else {
        this.commentId = comment.id
        this.sheetVisible = true
      }
    },
    onSended (dynamic) {
      this.detail = dynamic
    },
    deleteComment () {
      this.indicator.open('删除中...')
      this.axios.post(`dynamic/deleteComment.do`, querystring.stringify({
        commentId: this.commentId
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.indicator.close()
        }
      })
    },
    deleteDynamic () {
      this.messageBox.confirm('确定要删除此动态？', '删除动态').then(action => {
        if (action === 'confirm') {
          this.indicator.open('删除中...')
          this.doDelete()
        }
      }, cancel => {})
    },
    doDelete () {
      this.axios.post(`dynamic/delete.do`, querystring.stringify({
        id: this.detail.id
      })).then(response => {
        let result = response.data
        if (result.success) {
          this.indicator.close()
          this.toast({
            message: '删除成功',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.replace(this.fromPath)
          }, 1000)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .detail{
    .line{
      position: relative;
      &::after{
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #eee;
        transform: scaleY(0.5);
      }
    }
    padding: .15rem;
    padding-bottom: 1rem;
    .avatar{
      float: left;
      width: .36rem;
      height: .36rem;
      border-radius: 50%;
      & > img{
        display: block;
        width: 100%;
        border-radius: inherit;
      }
    }
    .right{
      margin-left: .46rem;
    }
    .info{
      display: flex;
      justify-content: space-between;
      font-size: .12rem;
      color: #666;
      line-height: .2rem;
    }
    .content{
      margin-top: .15rem;
      margin-bottom: .25rem;
      line-height: .22rem;
      overflow: hidden;
    }
    .zan-comment{
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
    .zan-main{
      display: flex;
      padding: .15rem;
      & + .comment-main{
        .line;
      }
    }
    .zans{
      overflow: hidden;
      margin-right:-.1rem;
      margin-bottom: -.06rem;
      & > .useravatar {
        float: left;
        width: .36rem;
        height: .36rem;
        margin: 0 .06rem .06rem 0;
        & > img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .icon{
      width: .16rem;
      height: .36rem;
      flex: 0 0 .16rem;
      margin-right: .12rem;
      display: block;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
    .icon-zan{
      .icon;
      background-image: url(../../assets/img/dynamic/icon-like.png);
    }
    .icon-comment{
      .icon;
      background-image: url(../../assets/img/dynamic/icon-comment-detail.png);
    }
    .comment-main{
      display: flex;
      padding: .15rem;
    }
    .flex{
      display: flex;
    }
    .comments{
      flex: 1;
      font-size: .13rem;
      & > li {
        margin: .15rem 0;
        &:first-child{
          margin-top: 0;
        }
      }
      .comment-content{
        flex: 1;
        & > .flex{
          justify-content: space-between;
        }
        &:active{
          background: rgba(0,0,0,.1);
        }
      }
      .useravatar{
        width: .36rem;
        height: .36rem;
        flex: 0 0 .36rem;
        margin-right: .11rem;
        & > img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .username{
        color: #4D7092;
      }
      .date{
        font-size: .11rem;
        color: #999;
      }
      .comment{
        margin-top: .04rem;
        line-height: .18rem;
        color: #666;
        word-break: break-all;
      }
    }
    .mint-actionsheet-listitem{
      color: red;
    }
  }
</style>
