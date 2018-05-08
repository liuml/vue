<template>
  <div id="add-dynamic">
    <mt-field :placeholder="placeholder" type="textarea" rows="2" v-model.trim="content"></mt-field>
    <mt-button type="primary" plain size="small" :disabled="content.length==0" @click.native="send">发送</mt-button>
  </div>
</template>
<script type="text/ecmascript-6">
import querystring from 'querystring'
export default{
  props: {
    comment: {
      type: Object
    },
    dynamicId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      content: ''
    }
  },
  computed: {
    placeholder () {
      if (this.comment.id) {
        // 回复
        return `回复${this.comment.userName}:`
      } else {
        return '评论'
      }
    }
  },
  methods: {
    send () {
      let params = {}
      if (this.comment.id) {
        params = {
          dynamicId: this.dynamicId,
          type: 2,
          content: this.content,
          commentId: this.comment.id
        }
      } else {
        params = {
          dynamicId: this.dynamicId,
          type: 1,
          content: this.content,
          commentId: 0
        }
      }
      this.addComment(params)
    },
    addComment (params) {
      this.indicator.open('发送中...')
      this.axios.post(`dynamic/comment.do`, querystring.stringify(params))
        .then(response => {
          let result = response.data
          if (result.success) {
            this.content = ''
            this.indicator.close()
            this.$emit('onSendSuccess', result.data)
          }
        })
    }
  }
}
</script>
<style lang="less" scoped>
#add-dynamic{
  display: flex;
  align-items: flex-end;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: .1rem 0 .1rem .15rem;
  background: #FAFAFA;
  border-top: 1px solid #eee;
  .mint-field{
    flex: 1;
    min-height: .35rem;
    border: 1px solid #CECECE;
    border-radius: 5px;
  }
  .mint-button{
    flex: 0 0 .6rem;
    height: .35rem;
    line-height: .35rem;
    background-color: transparent;
    color: #cca873;
    border: none;
    font-size: .15rem;
  }
}
</style>
