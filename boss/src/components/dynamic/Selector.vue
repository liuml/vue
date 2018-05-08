<template>
  <div class="selector" @click="openSelect">
    {{selectVal}} <i class="icon" :class="{open: pulldown}"></i>
    <ul v-show="pulldown" class="options">
      <li :class="{active: selectVal==option.value}" @click.stop="onSelect(option)" v-for="(option, index) in options" :key="index">{{option.value}}</li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      pulldown: false,
      selectVal: this.options[0].value
    }
  },
  methods: {
    openSelect () {
      this.pulldown = true
      document.body.style.background = '#F2F2F2'
      this.$parent.$refs.fixedHeader.style.background = '#F2F2F2'
    },
    onSelect (option) {
      this.selectVal = option.value
      this.pulldown = false
      document.body.style.background = ''
      this.$parent.$refs.fixedHeader.style.background = '#fff'
      this.$emit('onSelect', option)
    }
  }
}
</script>
<style lang="less" scoped>
  .selector{
    position: relative;
    font-size: .14rem;
    color: #666;
    .icon{
      height: 1em;
      width: .1rem;
      display: inline-block;
      vertical-align: middle;
      margin-left: 3px;
      background-image: url(../../assets/img/selector/icon-open.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      &.open{
        transform: rotate(180deg);
      }
    }
    .options{
      position: absolute;
      right: -.1rem;
      top: .34rem;
      background: #ffffff;
      border-radius: 4px;
      z-index: 1;
      &::before{
        content: '';
        width: .1rem;
        height: .1rem;
        display: block;
        border-top-left-radius: 4px;
        transform: rotate(45deg);
        position: absolute;
        right: .1rem;
        top: -.05rem;
        background: #ffffff;
      }
      & > li {
        height: .5rem;
        line-height: .48rem;
        padding: 0 .22rem 0 .15rem ;
        font-size: .15rem;
        color: #666;
        white-space: nowrap;
        text-align: right;
        & + li {
          border-top: 1px solid #d8d8d8;
        }
        &.active{
          color:#cca873;
          &::before{
            content: '';
            width: .17rem;
            height: 1em;
            display: inline-block;
            margin-right: .14rem;
            vertical-align: middle;
            background-image: url(../../assets/img/selector/icon-active.png);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }
    }
  }
</style>
