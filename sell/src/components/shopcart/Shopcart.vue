<template>
  <div class="shopCart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'hightlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'hightlight':totalCount>0}"></i>
          </div>
          <transition name="move">
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </transition>
        </div>
        <div class="price" :class="{'hightlight':totalPrice>0}">￥{{totalPrice}}元</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <transition name="drop" v-for="ball in balls" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div v-show="ball.show" class="ball">
          <div class="inner j-inner"></div>
        </div>
      </transition>
    </div>
    <transition name="fold" @after-enter="foldAfterEnter" @before-leave="foldBeforeLeave">
      <div class="shopcart-list" v-show="listShow">
        <div class="header">
          <h3 class="title">购物车</h3>
          <span class="empty">清空</span>
        </div>
        <div class="content">
          <ul>
            <li v-for="food in selectFoods" class="food">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>&yen;{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrl-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import CartControl from '../cartcontrol/CartControl.vue'

  export default {
    props: {
      selectFoods: {
        type: Array,
        default () {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      }
    },
    computed: {
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        let count = 0
        this.selectFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        return !this.fold
      }
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter (el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            let inner = el.getElementsByClassName('j-inner')[0]
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y}px,0)`
            el.style.transform = `translate3d(0,${y}px,0)`
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      enter (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.$nextTick(() => {
          let inner = el.getElementsByClassName('j-inner')[0]
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      foldAfterEnter (el) {
        el.style.webkitTransform = 'translate3d(0, -100%, 0)'
        el.style.transform = 'translate3d(0, -100%, 0)'
      },
      foldBeforeLeave (el) {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
      }
    },
    components: {
      'cartcontrol': CartControl
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopCart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    background #2c3e50
    .content
      display flex
      background #141d2b
      font-size 0
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d2f
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.hightlight
              background rgb(0,160,220)
            .icon-shopping_cart
              font-size 24px
              line-height 44px
              color #80858a
              &.hightlight
                color: #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,.4)
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          box-sizing border-box
          border-right 1px solid rgba(255,255,255,.1)
          padding-right 12px
          font-size 16px
          font-weight 700
          color rgba(255,255,255,.4)
          &.hightlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          line-height 24px
          margin 12px 0 0 12px
          color rgba(155,155,155,.4)
          font-size 12px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 14px
          font-weight 700
          color rgba(155,155,155,.4)
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color: #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        &.drop-enter,&.drop-enter-active
          transition all .5s cubic-bezier(0.49,-0.29,0.75,0.41)
          .inner
            width 16px
            height 16px
            border-radius 50%
            background rgb(0,160,220)
            transition all .5s linear

    .shopcart-list
      position: absolute
      top:0
      left:0
      width:100%
      z-index:-1
      transition: all .5s
      &.fold-enter-active, &.fold-leave-active
        transform: translate3d(0,-100%,0)
      &.fold-enter, &fold-leave-to
        transform: translate3d(0,0,0)
      .header
        height: 40px
        line-height: 40px
        padding: 0 18px
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        background: #f3f5f7
        .title
          float: left
          font-size: 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background-color: #fff
        .food
          position: relative
          padding:12px 0
          box-sizing: border-box
          border-1px(rgba(7,17,27,.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7,17,27)
          .price
            position: absolute
</style>
