<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
          <span class="text border-1">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list j-food-list">
          <h2 class="title">{{item.name}}</h2>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h3 class="name">{{food.name}}</h3>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">&yen;{{food.price}}</span><span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <CartControl :food="food" @increase="increase"></CartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>
<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll'
  import Shopcart from '@/components/shopcart/Shopcart'
  import CartControl from '@/components/cartcontrol/CartControl'
  const ERR_OK = 0
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      Shopcart,
      CartControl
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      }
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
            return i
          }
        }
        return 0
      },
      selectFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    methods: {
      increase (target) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      selectMenu (index, event) {
        // 移动端才为true，避免PC端两次触发点击事件回调函数
        if (!event._constructed) {
          return
        }
        this.foodsScroll.scrollTo(0, -this.listHeight[index], 1000)
//        let foodList = this.$refs.foodsWrapper.getElementsByClassName('j-food-list')
//        let el = foodList[index]
//        this.foodsScroll.scrollToElement(el, 300)
      },
      _initScroll () {
        this.menuScroll = new BetterScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new BetterScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        })
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('j-food-list')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
      this.$http.get('api/goods')
        .then((response) => {
          if (response.data.errno === ERR_OK) {
            this.goods = response.data.data
            this.$nextTick(() => {
              this._initScroll()
              this._calculateHeight()
            })
          }
        })
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        width: 56px
        height: 54px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background-color: #fff
          font-weight:700
          .text
            border-none()
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7,17,27,.1))
          font-size: 12px
          .icon
             display: inline-block
             width: 12px
             height: 12px
             vertical-align: top
             margin-right: 2px
             background-size: 12px
             background-repeat: no-repeat
             &.decrease
               bg-image("decrease_3")
             &.discount
               bg-image("discount_3")
             &.guarantee
               bg-image("guarantee_3")
             &.invoice
               bg-image("invoice_3")
             &.special
               bg-image("special_3")
    .foods-wrapper
      flex:1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display: flex
        margin:18px
        padding-bottom: 18px
        border-1px(rgba(7,17,27,.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex:1
          .name
            margin: 2px 0 8px
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7,17,27)
          .desc,.extra
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .desc
            line-height: 12px
          .extra
            margin: 8px 0
            span:first-child
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
          .cart-control-wrapper
            position: absolute
            right:0
            bottom: 12px
</style>
