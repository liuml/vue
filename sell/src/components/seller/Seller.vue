<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h2 class="title">{{seller.name}}</h2>
        <div class="desc border-1">
          <star :size="36" :score="seller.score" class="star"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h3>起送价</h3>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h3>商家配送</h3>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h3>平均配送时间</h3>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="bulletin">
        <h2 class="title">公告与活动</h2>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li v-for="item in seller.supports" class="support-item border-1">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h2 class="title">商家实景</h2>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li v-for="pic in seller.pics" class="pic-item">
              <img :src="pic" width="120" height="90" alt="">
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll'
  import Star from '@/components/star/Star'
  import Split from '@/components/split/Split'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    },
    mounted () {
      this.scroll = new BetterScroll(this.$refs.seller, {
        click: true
      })
      if (this.seller.pics) {
        let picW = 120
        let margin = 6
        let width = (picW + margin) * this.seller.pics.length - margin
        this.$refs.picList.style.width = width + 'px'
        this.$nextTick(() => {
          this.picScroll = new BetterScroll(this.$refs.picWrapper, {
            scrollX: true,
            eventPassthrough: 'vertical'
          })
        })
      }
    },
    components: {
      Star,
      Split
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7,17,27)
      .desc
        padding-bottom: 18px
        border-1px(rgba(7,17,27,.1))
        font-size: 0
        .star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .text
          margin-right: 12px
          display: inline-block
          line-height: 18px
          vertical-align: top
          font-size: 10px
          color: rgb(77,85,93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7,17,27,.1)
          &:last-child
            border: none
          h3
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7,17,27)
            .stress
              font-size: 24px
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7,17,27,.1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240,20,20)
      .supports
        .support-item
          padding: 16px 12px
          border-1px(rgba(7,17,27,.1))
          font-size: 0
          &:last-child
            border-none()
          .icon
            display: inline-block
            width: 16px
            height: 16px
            vertical-align: top
            margin-right: 6px
            background-size: 16px
            background-repeat: no-repeat
            &.decrease
              bg-image("decrease_4")
            &.discount
              bg-image("discount_4")
            &.guarantee
              bg-image("guarantee_4")
            &.invoice
              bg-image("invoice_4")
            &.special
              bg-image("special_4")
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
          &:last-child
            margin-right: 0
</style>
