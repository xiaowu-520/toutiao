<template>
  <div>
    <div class="navbar">
      <van-nav-bar title="黑马头条" left-arrow @click-left="ClickBack" />
    </div>
    <!-- 文章内容组件 -->
    <ArticleContent
      :articles="articles"
      @isFollowed="articles.is_followed = $event"
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
        :commentnum="index"
        @onComments="item.is_liking"
        @onReply="onReply"
      ></ArticleComments>
    </van-list>
    <!-- 底部按钮 -->
    <div class="article-bottom">
      <van-button class="comment-btn" @click.stop="isShow = !isShow"
        >写评论</van-button
      >
      <van-icon name="comment-o" :badge="commentsNum" />
      <van-icon
        name="star-o"
        @click="onCollect"
        :color="isCollect ? '#ffa500' : ''"
        :loading="CollectLoading"
      />
      <van-icon
        name="good-job-o"
        @click="onLike"
        :color="isLike === -1 ? '' : '#ffa500'"
        :loading="LikeLoading"
      />
      <van-icon name="share-o" @click="showShare = true"> </van-icon>
      <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
      />
    </div>
    <!-- 一级评论弹出层 -->
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
        <van-button class="fabu" @click="onAddComment">发布</van-button>
      </div>
    </van-popup>
    <!-- 二级评论弹出层 -->
    <div class="TwoPopup">
      <van-popup
        v-model="isPopup"
        closeable
        position="bottom"
        :style="{ height: '100%' }"
      >
        <van-nav-bar
          class="commentNav"
          title="暂无评论"
          v-if="SecondCommentsNum === 0"
        />
        <van-nav-bar
          class="commentNav"
          :title="`${SecondCommentsNum}条回复`"
          v-else
        />
        <div class="scroll-box">
          <ArticleComments :Comments="nowComment" />
          <div>
            <!-- 无评论时占位符 -->
            <van-empty v-if="SecondCommentsNum === 0" description="暂无回复" />
            <van-cell title="全部回复" v-else />
          </div>
          <div>
            <van-list
              v-model="Secondloading"
              :finished="SecondFinished"
              :error.sync="error"
              error-text="请求失败，点击重新加载"
              finished-text="没有更多了"
              @load="SecondLoad"
            >
              <ArticleComments
                v-for="item in SecondComments"
                :key="item.com_id"
                :Comments="item"
              ></ArticleComments>
            </van-list>
          </div>
          <!-- 底部按钮 -->
          <div class="post-warp">
            <van-cell>
              <van-button round type="info" @click="SecondShow = !SecondShow"
                >评论</van-button
              >
            </van-cell>
          </div>
          <van-popup v-model="SecondShow" position="bottom">
            <div class="comment-post">
              <van-field
                v-model="Secondmessage"
                rows="2"
                autosize
                type="textarea"
                maxlength="50"
                placeholder="请输入回复内容"
                show-word-limit
              />
              <van-button class="fabu" @click="onSencondComent"
                >发布</van-button
              >
            </div>
          </van-popup>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getArticleComments,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { addComments } from '@/api/comment'
import ArticleComments from './components/ArticleComments.vue'
import ArticleContent from './components/ArticleContent.vue'
export default {
  data() {
    return {
      isShow: false, // 是否显示发布评论
      SecondShow: false,
      message: '', // 发布一级评论内容
      Secondmessage: '',
      articles: {}, // 文章信息
      articleComments: [], // 文章评论
      SecondComments: [], // 二级评论
      loading: false,
      finished: false,
      error: false,
      immediateCheck: false,
      CommentsLastID: '', // 最后一条评论ID
      commentsNum: '', // 文章评论数量
      isCollect: '', // 是否收藏
      CollectLoading: false,
      LikeLoading: false,
      isLike: '', // 是否点赞
      isPopup: false, // 是否显示二级评论
      SecondCommentsNum: '', // 回复数量
      nowComment: '', // 当前被点击的评论
      Secondloading: false,
      SecondFinished: false,
      SecondCommentsLastID: '', // 最后一条评论ID
      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ]
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
        this.isCollect = data.data.is_collected
        this.isLike = data.data.attitude
        // console.log(this.articles)
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
        // console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 加载下一页评论
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
    },
    // 是否收藏
    async onCollect() {
      this.CollectLoading = true
      try {
        if (this.isCollect) {
          await deleteCollect(this.articles.art_id)
        } else {
          await addCollect(this.articles.art_id)
        }
        this.isCollect = !this.isCollect
      } catch (error) {
        console.log(error)
      }
      this.CollectLoading = false
    },
    // 是否点赞
    async onLike() {
      this.LikeLoading = true
      try {
        if (this.isLike === -1) {
          await addLike(this.articles.art_id)
          this.isLike = 1
        } else if (this.isLike === 1) {
          await deleteLike(this.articles.art_id)
          this.isLike = -1
        }
        // this.isLike = !this.isLike
      } catch (error) {
        console.log(error)
      }
      this.LikeLoading = false
    },
    // 点击回复
    async onReply(comments) {
      this.isPopup = true
      this.nowComment = comments
      try {
        const { data } = await getArticleComments('c', comments.com_id)
        this.SecondCommentsNum = data.data.total_count
        this.SecondComments = data.data.results
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 加载二级评论
    async SecondLoad() {
      try {
        const { data } = await getArticleComments(
          'c',
          this.nowComment.com_id,
          this.SecondCommentsLastID,
          '10'
        )
        this.Secondloading = false
        this.SecondCommentsLastID = data.data.last_id
        this.SecondComments = data.data.results
        if (this.SecondCommentsLastID === data.data.end_id) {
          this.Secondloading = true
          this.SecondFinished = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 发布评论
    async onAddComment() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duation: 0
      })
      if (this.message.trim().length === 0) {
        return this.$toast.fail('请输入内容')
      }
      try {
        const { data } = await addComments(
          this.$route.params.articleId,
          this.message
        )
        if (data.message === 'OK') {
          this.$toast.success('评论发布成功')
        }
        this.getArticleComments()
      } catch (error) {
        console.log(error)
      } finally {
        this.message = '' // 清空输入框
        this.isShow = false // 关闭输入框
      }
    },
    // 回复评论
    async onSencondComent() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duation: 0
      })
      if (this.Secondmessage.trim().length === 0) {
        return this.$toast.fail('请输入内容')
      }
      try {
        const { data } = await addComments(
          this.nowComment.com_id,
          this.Secondmessage,
          this.$route.params.articleId
        )
        if (data.message === 'OK') {
          this.$toast.success('评论发布成功')
        }
        this.getArticleComments()
        this.SecondLoad()
      } catch (error) {
        console.log(error)
      } finally {
        this.Secondmessage = '' // 清空输入框
        this.SecondShow = false // 关闭输入框
      }
    },
    onSelect(option) {
      this.showShare = false
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

// 关闭图标按钮
:deep(.van-popup__close-icon) {
  color: #6ba3d8;
}

:deep(.TwoPopup [data-v-978e6664] .van-nav-bar__content) {
  background-color: #fff;
}
:deep(.TwoPopup [data-v-978e6664] .van-nav-bar__title) {
  color: #323233;
}

.post-warp {
  width: 100%;
  height: 1.33333rem;
  position: fixed;
  bottom: 0;
  border-top: 0.01333rem solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff69b4;
  .van-button {
    width: 8.53333rem;
    height: 1.06667rem;
    border-radius: 26.64rem;
    padding: 0 0.4rem;
    font-size: 0.37333rem;
    color: #323233;
    background-color: #fff;
    border: 0.02667rem solid #ebedf0;
  }
}
.post-warp .van-button[data-v-978e6664] {
  background-color: #ff69b4;
}
</style>
