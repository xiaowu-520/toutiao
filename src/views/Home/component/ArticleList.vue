<template>
  <div>
    <van-pull-refresh
      v-model="refreshLoading"
      success-text="刷新成功"
      @refresh="LoadNextPage"
    >
      <van-list
        @load="LoadNextPage"
        :finished="finished"
        v-model="loading"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :immediate-check="immediateCheck"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/api/news'
import ArticleItem from './ArticleItem.vue'
export default {
  data() {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      refreshLoading: false,
      finished: false,
      error: false,
      immediateCheck: false
    }
  },
  components: {
    ArticleItem
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    async getArticleList() {
      try {
        const { data } = await getArticleList(this.id, +new Date())
        // console.log(data)
        // 保存第一页的页码
        this.pre_timestamp = data.data.pre_timestamp
        this.articles = data.data.results
      } catch (error) {
        const status = error.response.status
        if (status === 404) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('请重新刷新')
        }
      }
    },
    // 获取下一页的数据
    async LoadNextPage() {
      try {
        console.log('加载了数据')
        const { data } = await getArticleList(this.id, this.pre_timestamp)
        if (!data.data.pre_timestamp) {
          this.finished = true
          return
        }
        if (this.refreshLoading) {
          // 下拉刷新放前面
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        // 更新下一页数据
        this.pre_timestamp = data.data.pre_timestamp
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>

<style></style>
