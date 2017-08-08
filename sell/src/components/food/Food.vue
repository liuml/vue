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
          <RatingSelect :ratings="food.ratings" :select-type="initialSelectType" :only-content="initialOnlyContent" :desc="desc"></RatingSelect>
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
        initialOnlyContent: true,
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
        this.initialOnlyContent = true
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
</style>
