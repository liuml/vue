<template>
  <div class="cart-control">
    <transition name="move" enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
      <div class="decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decrease($event)">
      </div>
    </transition>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="increase icon-add_circle" @click.stop="increase($event)"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      increase (event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count ++
        }
        this.$emit('increase', event.target)
      },
      decrease (event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count --
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cart-control
    font-size: 0
    .decrease,.increase
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)
      &.move-enter-active,&.move-leave-active
        transform: rotate(0)
      &.move-enter,&.move-leave-to
        transform: rotate(180deg)
    .count
      display: inline-block
      vertical-align: top
      width: 12px
      padding: 6px
      line-height: 24px
      font-size: 10px
      text-align: center
      color: rgb(147,153,159)

</style>
