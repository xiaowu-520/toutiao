<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="searchItem(index)"
    >
      <!-- 使用 icon 插槽来自定义图标 -->
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getSuggest } from '@/api/search'
export default {
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  watch: {
    keywords: {
      immediate: true,
      handler() {
        this.getSuggest()
      }
    }
  },
  methods: {
    async getSuggest() {
      try {
        const res = await getSuggest(this.keywords)
        this.suggestions = res.data.data.options.filter(Boolean)
        if (res.data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.suggestions = res.data.data.options
        // console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    searchItem(index) {
      this.$parent.value = this.suggestions[index]
      const res = this.$parent.historys.indexOf(this.suggestions[index])
      if (res !== -1) {
        this.historys.splice(res, 1)
      }
      this.$parent.historys.unshift(this.suggestions[index])
      this.$parent.showResult = true
    }
  },
  computed: {
    highlightData() {
      // 将搜索建议每一项处理
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggestions.map((str) =>
        str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.search-icon {
  padding-top: 10px;
}
</style>
