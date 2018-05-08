<template>
  <div class="radio-list">
    <label class="radio-list-label" v-for="(option,index) in options" :key="index">
      <span class="mint-radio">
        <input type="radio" class="mint-radio-input" v-model="currentValue" :disabled="option.disabled" :value="option.value || option">
        <span class="mint-radio-core"></span>
      </span>
      <span class="radio-label" :class="{checked: option.value === currentValue}" v-text="option.label || option"></span>
    </label>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: {
    options: {
      type: Array,
      required: true
    },
    value: String
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang="less" scoped>
  .radio-label{
    vertical-align: middle;
    margin-left: 3px;
    &.checked{
      color: #333;
    }
  }
</style>
