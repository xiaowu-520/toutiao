<template>
  <div>
    <van-list
      @load="LoadNextPage"
      :finished="finished"
      v-model="loading"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        :title="item.title"
        v-for="(item, index) in results"
        :key="index"
      />
    </van-list>
  </div>
</template>

<script>
import { getResult } from '@/api/search'

export default {
  data() {
    return {
      results: [],
      page: 1,
      per_page: 10,
      loading: false,
      finished: false,
      error: false
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  created() {
    this.getResult()
  },
  methods: {
    async getResult() {
      try {
        const { data } = await getResult(this.keywords)
        this.results = data.data.results
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取下一页的数据
    async LoadNextPage() {
      try {
        const { data } = await getResult(
          this.keywords,
          this.page,
          this.per_page
        )
        this.results.push(...data.data.results)
        this.loading = false

        if (data.data.results.length) {
          this.page++ // 更新获取下一页数据的页码
        } else {
          this.finished = true // 没有数据了，将加载状态设置结束，不再 onLoad
        }
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
