<template>
  <div style="margin-top: 1.22667rem">
    <h1 class="article-title">{{ articles.title }}</h1>
    <van-cell :border="false" center>
      <template #icon>
        <van-image class="van-image" round :src="articles.aut_photo" />
      </template>
      <template #title>
        <div>{{ articles.aut_name }}</div>
      </template>
      <template #label>
        <div>{{ articleDesc }}</div>
      </template>
      <template #default>
        <van-button
          class="attention"
          v-if="!articles.is_followed"
          :loading="followLoading"
          @click="followed"
          >+关注
        </van-button>
        <van-button
          class="attention"
          v-else
          :loading="followLoading"
          @click="followed"
          >已关注
        </van-button>
      </template>
    </van-cell>
    <div class="article-content markdown-body" v-html="articles.content"></div>
    <van-divider>正文结束</van-divider>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { addFollow, deleteFollow } from '@/api/article'
import '@/assets/css/news.css'
export default {
  data() {
    return {
      followLoading: false
    }
  },
  props: {
    articles: {
      type: Object,
      required: true
    }
  },

  methods: {
    // 关注取消用户
    async followed() {
      this.followLoading = true
      try {
        if (this.articles.is_followed) {
          await addFollow(this.articles.aut_id)
        } else {
          await deleteFollow(this.articles.aut_id)
        }
        this.$emit('isFollowed', !this.articles.is_followed)
      } catch (error) {
        console.log(error)
      }
      this.followLoading = false
    }
  },
  //   文章时间格式化
  computed: {
    articleDesc() {
      const relativeTime = dayjs(this.articles.pubdate).fromNow()
      return relativeTime
    }
  }
}
</script>

<style lang="less">
.van-image {
  width: 0.93333rem;
  height: 0.93333rem;
  margin-right: 0.22667rem;
  position: relative;
  display: inline-block;
}
.article-title {
  font-size: 0.53333rem;
  padding: 0.66667rem 0.42667rem;
  margin: 0;
  color: #3a3a3a;
  display: block;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  margin: 0;
}

:deep(.van-image--round) {
  overflow: hidden;
  border-radius: 50%;
}
.attention {
  color: white;
  background: rgb(50, 150, 250);
  border-color: rgb(50, 150, 250);
  width: 2.26667rem;
  height: 0.77333rem;
  border-radius: 26.64rem;
  padding: 0 0.21333rem;
  font-size: 0.32rem;
}
.markdown-body h1 {
  border-bottom: 0.01333rem var(--color-border-muted);
}

.title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.van-image {
  width: 0.93333rem;
  height: 0.93333rem;
  margin-right: 0.22667rem;
  position: relative;
  display: inline-block;
}
.reply-btn {
  width: 1.8rem;
  height: 0.64rem;
  line-height: 0.64rem;
  font-size: 0.28rem;
  color: #222;
  border-radius: 26.64rem;
}

.username {
  color: #406599;
  font-size: 0.34667rem;
}

.like-btn {
  height: 0.4rem;
  padding: 0;
  border: none;
  font-size: 0.25333rem;
  line-height: 0.4rem;
  margin-right: 0.09333rem;
  color: #323233;
  background-color: #fff;
}

.comment-content {
  font-size: 0.42667rem;
  color: #222;
  word-break: break-all;
  text-align: justify;
}

.bottom-info {
  display: flex;
  align-items: center;
  .comment-pubdate {
    font-size: 0.25333rem;
    color: #222;
    margin-right: 0.33333rem;
  }
}
</style>
