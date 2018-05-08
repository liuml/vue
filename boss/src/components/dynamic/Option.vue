<template>
  <div class="option">
    <span class="link text-ellipsis" @click="toDetail" v-if="data.dynamicType==102 || data.dynamicType==9">{{data.dynamicTypeName}}</span>
    <div>
      <span class="zan" :class="{active: data.likeStatus==2}" @click="toggleLike">{{data.likes.length}}</span>
      <span class="comment" @click="onComment">{{data.comments.length}}</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    toDetail () {
      let id = this.data.dynamicTypeId
      switch (this.data.dynamicType) {
        case 102:
          this.$router.push(`/microCourseDetail/${id}`)
          break
        case 9:
          this.$router.push(`/courseDetail/${id}`)
          break
      }
    },
    toggleLike () {
      this.$emit('toggle-like', this.data.likeStatus)
    },
    onComment () {
      this.$emit('onComment', this.data.id)
    }
  }
}
</script>
<style lang="less" scoped>
  .option{
    overflow: hidden;
    padding: .15rem 0;
    color: #999;
    font-size: .12rem;
    & > div{
      float: right;
      white-space: nowrap;
    }
    .icon{
      content: '';
      display: inline-block;
      margin-right: 5px;
      height: .16rem;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      vertical-align: text-bottom;
    }
    .border-left{
      border-left: .15rem solid transparent;
    }
    .border-tb{
      border-top: .15rem solid transparent;
      border-bottom: .15rem solid transparent;
    }
    .link{
      color:#333333;
      .border-tb;
      &::before{
        .icon;
        background-image: url(../../assets/img/dynamic/icon-link.png);
        width: .13rem;
      }
    }
    .zan{
      .border-left;
      .border-tb;
      &::before{
        .icon;
        background-image: url(../../assets/img/dynamic/icon-zan.png);
        width: .15rem;
      }
      .active{
        background-image: url(../../assets/img/dynamic/icon-zan-active.png);
      }
      &.active{
        color:#cca873;
        &::before{
          background-image: url(../../assets/img/dynamic/icon-zan-active.png);
        }
      }
    }
    .comment{
      .border-left;
      .border-tb;
      &::before{
        .icon;
        background-image: url(../../assets/img/dynamic/icon-comment.png);
        width: .16rem;
      }
    }
  }
</style>
