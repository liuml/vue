<template>
  <div class="search">
    <div class="searchbar">
      <div class="searchbar-inner">
        <i class="icon-search"></i>
        <input
          ref="input"
          autocomplete="off"
          @focus="onFocus"
          @blur="onBlur"
          @search="onSearch"
          type="search"
          v-model="currentValue"
          :placeholder="placeholder"
          class="searchbar-core">
        <i class="icon-clear" v-show="currentValue.length" @click="currentValue='';$emit('clear')"></i>
      </div>
      <a
        class="searchbar-cancel"
        @click="visible = false, currentValue = ''"
        v-show="visible"
        v-text="cancelText">
      </a>
    </div>
    <div class="search-mask" v-show="showMask"></div>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: {
    value: String,
    autofocus: Boolean,
    cancelText: {
      default: '取消'
    },
    placeholder: {
      default: '搜索'
    }
  },
  data () {
    return {
      visible: false,
      showMask: false,
      currentValue: this.value
    }
  },
  watch: {
    currentValue (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.currentValue = val
    }
  },
  mounted () {
    this.autofocus && this.$refs.input.focus()
  },
  methods: {
    onFocus () {
      this.visible = true
      this.showMask = true
      this.$emit('on-focus')
    },
    onBlur () {
      this.visible = false
      this.showMask = false
      this.$emit('on-blur')
    },
    onSearch () {
      this.$refs.input.blur()
      this.$emit('on-search')
    }
  }
}
</script>
<style lang="less" scoped>
.search{
  .searchbar{
    position: fixed;
    top: .44rem;
    left: 0;
    right: 0;
    display: flex;
    padding: 8px .15rem;
    z-index: 1;
    align-items: center;
    background-color: #ffffff;
    border-bottom: 1px solid #f0f0f0;
  }
  .searchbar-inner{
    align-items: center;
    background-color: #ffffff;
    border-radius: 2px;
    display: flex;
    flex: 1;
    height: .3rem;
    padding: 4px 0;
    .icon-search {
      width: .3rem;
      height: .3rem;
      display: inline-block;
      background-image: url(../../assets/img/search/icon-search.png);
      background-size: .2rem;
      background-repeat: no-repeat;
      background-position: left center;
    }
    .icon-clear{
      font-family: "mintui" !important;
      font-size: .18rem;
      font-style: normal;
      opacity: .2;
      &::before{
        content: "\E605";
      }
    }
    .searchbar-core{
      flex: 1;
      height: 100%;
      font-size: .2rem;
      outline: 0;
      appearance: none;
      border: 0;
    }
  }
  .searchbar-cancel{
    margin-left: 5px;
    font-size: .18rem;
    color: #cca873;
  }
  .search-mask{
    position: fixed;
    left: 0;
    right: 0;
    top: .9rem;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
  }
  //干掉input[search]默认的clear button
  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    display: none;
  }
}
</style>
