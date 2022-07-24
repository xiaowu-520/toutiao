<template>
  <div>
    <div class="navbar">
      <van-nav-bar title="黑马头条" left-arrow @click-left="ClickBack" />
    </div>
    <!-- 文章内容组件 -->
    <ArticleContent
      :ArticleId="$route.params.articleId"
      :articles="articles"
    ></ArticleContent>
    <!-- 评论列表 -->
    <van-list
      style="margin-bottom: 47.775px"
      v-model="loading"
      :finished="finished"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      finished-text="没有更多了"
      :immediate-check="immediateCheck"
      @load="LoadNextPage"
    >
      <!-- 评论内容组件 -->
      <ArticleComments
        v-for="(item, index) in articleComments"
        :key="index"
        :Comments="item"
      ></ArticleComments>
    </van-list>
    <!-- 底部按钮 -->
    <div class="article-bottom">
      <van-button class="comment-btn" @click.stop="isShow = !isShow"
        >写评论</van-button
      >
      <van-icon name="comment-o" :badge="commentsNum" />
      <van-icon name="star-o" />
      <van-icon name="good-job-o" />
      <van-icon name="share-o" />
    </div>
    <van-popup v-model="isShow" position="bottom">
      <div class="comment-post">
        <van-field
          v-model="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <van-button class="fabu">发布</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getArticles, getArticleComments } from '@/api/article'
import ArticleComments from './components/ArticleComments.vue'
import ArticleContent from './components/ArticleContent.vue'
export default {
  data() {
    return {
      isShow: false,
      message: '',
      articles: {},
      articleComments: [],
      loading: false,
      finished: false,
      error: false,
      immediateCheck: false,
      CommentsLastID: '',
      commentsNum: ''
    }
  },
  created() {
    this.getArticle()
    this.getArticleComments()
  },
  components: {
    ArticleContent,
    ArticleComments
  },
  methods: {
    ClickBack() {
      this.$router.back()
    },
    // 获取文章内容
    async getArticle() {
      try {
        const { data } = await getArticles(this.$route.params.articleId)
        this.articles = data.data
      } catch (error) {
        console.log(error)
      }
    },
    // 获取评论
    async getArticleComments() {
      try {
        const { data } = await getArticleComments(
          'a',
          this.$route.params.articleId
        )
        this.articleComments = data.data.results
        this.CommentsLastID = data.data.last_id
        this.commentsNum = data.data.total_count
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    async LoadNextPage() {
      try {
        const { data } = await getArticleComments(
          'a',
          this.$route.params.articleId,
          this.CommentsLastID,
          '10'
        )
        this.loading = false
        this.CommentsLastID = data.data.last_id
        this.articleComments.push(...data.data.results)
        if (data.data.last_id === data.data.end_id) {
          this.loading = true
          this.finished = true
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
:deep(.van-nav-bar__content) {
  background-color: #3296fa;
  color: #fff;
}
:deep(.van-nav-bar__title) {
  color: #fff;
}
:deep(.van-icon) {
  color: #fff;
}
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 1.17333rem;
  border-top: 0.01333rem solid #d8d8d8;
  background-color: #fff;
  .van-icon {
    color: rgb(119, 119, 119);
    font-size: 0.53333rem;
  }
}
.comment-btn {
  width: 3.76rem;
  height: 0.61333rem;
  border: 0.02667rem solid #eee;
  font-size: 0.4rem;
  line-height: 0.61333rem;
  color: #a7a7a7;
  border-radius: 26.64rem;
}

.comment-post {
  display: flex;
  align-items: center;
  padding: 0.42667rem 0 0.42667rem 0.42667rem rem;
}
// :deep(.van-cell) {
//   background-color: #f5f7f9;
// }

.comment-post {
  display: flex;
  align-items: center;
  padding: 0.42667rem rem 0 0.42667rem 0.42667rem;
}

.fabu {
  width: 2rem;
  border: none;
  padding: 0;
  color: #6ba3d8;
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
