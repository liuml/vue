<template>
  <mt-popup
    v-model="showPopup"
    position="bottom">
    <mt-picker :slots="slots" @change="onChange" showToolbar>
      <span class="cancel" @click="onCancel">取消</span>
      <span class="confirm" @click="onConfirm">确定</span>
    </mt-picker>
  </mt-popup>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    slots: {
      type: Array,
      required: true
    }
  },
  watch: {
    show (value) {
      this.showPopup = value
    },
    showPopup (value) {
      this.$emit('update:show', value)
    }
  },
  data () {
    return {
      showPopup: this.show,
      values: []
    }
  },
  methods: {
    onChange (picker, values) {
      this.values = values
      this.$emit('change', picker, values)
    },
    onCancel () {
      this.$emit('cancel')
    },
    onConfirm () {
      this.$emit('confirm', this.values)
    }
  }
}
</script>
