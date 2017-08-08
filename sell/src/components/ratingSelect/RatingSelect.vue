<template>
  <div class="rating-select">
    <div class="rating-type border-1">
      <span class="inline-block positive" :class="{'active':selectType===2}" @click="select(2, $event)">{{desc.all}}<span class="count">40</span></span>
      <span class="inline-block positive" :class="{'active':selectType===0}" @click="select(0, $event)">{{desc.positive}}<span class="count">40</span></span>
      <span class="inline-block negtive" :class="{'active':selectType===1}" @click="select(1, $event)">{{desc.negtive}}<span class="count">40</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
//  const POSITIVE = 0
//  const NEGTIVE = 1
  const ALL = 2
  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      initialSelectType: {
        type: Number,
        default: ALL
      },
      initialOnlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negtive: '不满意'
          }
        }
      }
    },
    data () {
      return {
        selectType: this.initialSelectType,
        onlyContent: this.initialOnlyContent
      }
    },
    methods: {
      select (type, event) {
        if (!event._constructed) {
          return
        }
        this.selectType = type
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin.styl"
  .rating-select
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7,17,27,.1))
      font-size: 0
      .inline-block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77,85,93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0,160,220,.2)
          &.active
            background: rgb(0,160,220)
        &.negtive
          background: rgba(77,85,93,.2)
          &.active
            background: rgb(77,85,93)
    .switch
      padding:12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7,17,27,.1)
      color: rgb(147,153,159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        font-size: 12px
</style>
