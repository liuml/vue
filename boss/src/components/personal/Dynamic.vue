<template>
  <div class="personal-dynamic" :class="{visibleDate:dynamic.visibility}" @click="$router.push(`/dynamicDetail/${dynamic.id}`)">
    <div class="date recently" v-html="dynamicDate" :style="{visibility:dynamic.visibility}"></div>
    <ul class="content">
      <li>
        <img v-if="dynamic.dynamicImageUris && dynamic.dynamicImageUris.length" class="dynamic-img" :src="$root.imgBaseurl+dynamic.dynamicImageUris[0]" alt="">
        <div class="detail" :class="{bg: !dynamic.dynamicImageUris || dynamic.dynamicImageUris.length===0}">
          <p>{{dynamic.dynamicContent}}</p>
          <div class="pic-num" v-if="dynamic.dynamicImageUris && dynamic.dynamicImageUris.length>0">共{{dynamic.dynamicImageUris.length}}张</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
export default{
  props: {
    dynamic: {
      type: Object,
      required: true
    }
  },
  computed: {
    dynamicDate () {
      let date = this.dynamic.dynamicCreateTime
      let now = Date.now()
      let interval = now - date
      let oneDay = 24 * 60 * 60 * 1000
      let currentYear = new Date().getFullYear()
      let year = new Date(date).getFullYear()
      let month = new Date(date).getMonth() + 1
      let day = new Date(date).getDate()
      if (interval <= oneDay) {
        return '今天'
      } else if (interval <= 2 * oneDay) {
        return '昨天'
      } else if (currentYear === year) {
        return `<span class="day">${day}</span><span class="month">${month}月</span>`
      } else {
        return `<span class="day">${day}</span><span class="month">${month}月</span><div class="year">${year}年</div>`
      }
    }
  }
}
</script>
<style lang="less">
  .personal-dynamic{
    margin-top: .4rem;
    display: flex;
    &.visibleDate{
      margin: .2rem 0;
    }
    .date{
      flex: 0 0 .78rem;
      padding: 0 .15rem;
      font-size: .24rem;
      .day{
        font-size: .21rem;
      }
      .month{
        font-size: .12rem;
      }
      .year{
        font-size: .13rem;
        color: #999;
      }
    }
    & > .content{
      flex: 1;
      padding-right: .15rem;
      li{
        display: flex;
      }
      .dynamic-img{
        width: .9rem;
        flex: 0 0 .9rem;
        height: .9rem;
        object-fit: cover;
        margin-right: .1rem;
      }
      .detail{
        flex: 1;
        width: 1.8rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &.bg{
          padding: .1rem .08rem;
          background: #f7f7f7;
        }
        p{
          font-size: .15rem;
          line-height: .2rem;
          word-break: break-all;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .pic-num{
          font-size: .12rem;
          color: #999;
        }
      }
    }
  }
</style>
