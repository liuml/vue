<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="main">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide"><i class="icon-arrow_lift"></i></div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">&yen;{{food.price}}</span><span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <CartControl :food="food" @increase="increase"></CartControl>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
          </transition>
        </div>
        <Split v-show="food.info"></Split>
        <div class="info" v-show="food.info">
          <h2 class="title">商品信息</h2>
          <p class="text">{{food.info}}</p>
        </div>
        <Split></Split>
        <div class="rating">
          <h2 class="title">商品评价</h2>
          <RatingSelect @changeSelect="select" @toggleContent="contentToggle" :ratings="food.ratings" :select-type="initialSelectType" :only-content="initialOnlyContent" :desc="desc"></RatingSelect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="isShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt="" width="12" height="12" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BetterScroll from 'better-scroll'
  import CartControl from '@/components/cartcontrol/CartControl'
  import Split from '@/components/split/Split'
  import RatingSelect from '@/components/ratingSelect/RatingSelect'
  import {formate} from '@/common/js/date'

//  const POSITIVE = 0
//  const NEGTIVE = 1
  const ALL = 2
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false,
        initialSelectType: ALL,
        initialOnlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negtive: '吐槽'
        }
      }
    },
    methods: {
      show () {
        this.showFlag = true
        this.initialSelectType = ALL
        this.initialOnlyContent = false
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BetterScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide () {
        this.showFlag = false
      },
      addFirst (event) {
        if (!event._constructed) {
          return
        }
        this.increase(event.target)
        Vue.set(this.food, 'count', 1)
      },
      increase (target) {
        this.$nextTick(() => {
          this.$parent.$refs.shopcart.drop(target)
        })
      },
      select (type) {
        this.initialSelectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      contentToggle (onlyContent) {
        this.initialOnlyContent = onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      isShow (type, text) {
        if (this.initialOnlyContent && !text) {
          return false
        }
        if (this.initialSelectType === ALL) {
          return true
        } else {
          return type === this.initialSelectType
        }
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      CartControl,
      Split,
      RatingSelect
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .food
    position: fixed
    left:0
    top:0
    bottom: 48px
    z-index:30
    width: 100%
    background: #fff
    transition: all .2s linear
    transform: translate3d(0,0,0)
    &.move-enter-active,&.move-leave-active
      transform: translate3d(100%,0,0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top:0
        left:0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #fff
    .content
      padding: 18px
      position: relative
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7,17,27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count,.rating
          font-size: 10px
          color: rgb(147,153,159)
        .sell-count
          margin-right: 12px
      .price
        line-height: 24px
        font-weight:700
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240,20,20)
        .old
          font-size: 10px
          text-decoration: line-through
          color: rgb(147,153,159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0,160,220)

    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size: 14px
        color: rgb(7,17,27)
      .text
        padding: 0 8px
        line-height: 24px
        font-size: 12px
        color: rgb(77,85,93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7,17,27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7,17,27,.1))
          .user
            position: absolute
            right:0
            top: 16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              vertical-align: top
              margin-right: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(147,153,159)
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px
            line-height: 12px
            font-size: 10px
            color: rgb(147,153,159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right: 4px
              line-height: 16px
            .icon-thumb_up
              color: rgb(0,160,220)
            .icon-thumb_down
              color: rgb(147,153,159)
      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147,153,159)
</style>
