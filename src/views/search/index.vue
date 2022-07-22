<template>
  <div>
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="showSuggest"
      />
    </form>
    <component
      :is="componentName"
      :keywords="value"
      :historys="historys"
    ></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory'
import SearchResult from './components/SearchResult'
import SearchSuggestion from './components/SearchSuggestion'
import { getHistoryByLocal, setHistoryToLocal } from '@/api/search'
export default {
  data() {
    return {
      value: '',
      showResult: false,
      historys: getHistoryByLocal() || []
    }
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  methods: {
    onSearch(val) {
      // 获取输入框内容
      this.value = val
      // 存储搜索历史，并判断有无重复
      const index = this.historys.indexOf(val)
      if (index !== -1) {
        this.historys.splice(index, 1)
      }
      this.historys.unshift(val)
      this.showResult = true
    },
    onCancel() {
      this.$router.go(-1)
    },
    showSuggest() {
      this.showResult = false
    }
  },
  computed: {
    componentName() {
      if (this.value.trim() === '') return 'SearchHistory'
      if (this.showResult) return 'SearchResult'
      return 'SearchSuggestion'
    }
  },
  watch: {
    historys: {
      handler(val) {
        setHistoryToLocal(val)
      },
      deep: true
    }
  }
}
</script>

<style></style>
