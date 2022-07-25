<template>
  <div>
    <van-cell>
      <template #icon>
        <van-image class="van-image" round :src="Comments.aut_photo" />
      </template>
      <template #title>
        <div class="title-wrap">
          <div class="username">{{ Comments.aut_name }}</div>
          <van-button class="like-btn" @click="onCommentsLike">
            <template #icon>
              <span class="iconfont icon-dianzan2"></span>
            </template>
            <span>{{ Comments.like_count || '赞' }}</span>
          </van-button>
        </div>
      </template>
      <template #label>
        <div>
          <p class="comment-content">{{ Comments.content }}</p>
          <div class="bottom-info">
            <span class="comment-pubdate"> {{ articleCom }}</span>
            <van-button class="reply-btn" @click="replyCommets">
              <span> 回复 {{ Comments.reply_count }} </span>
            </van-button>
          </div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { addCommentLike, deleteCommentLike } from '@/api/comment'
export default {
  data() {
    return {}
  },
  props: {
    Comments: {
      type: Object,
      required: true
    },
    commentnum: {
      type: Number
    }
  },

  methods: {
    // 评论点赞
    async onCommentsLike() {
      // this.commentsLike = this.Comments.like_count
      try {
        if (this.Comments.is_liking) {
          await addCommentLike(this.Comments.com_id)
          this.$parent.$options.parent.articleComments[
            this.commentnum
          ].is_liking = false
          this.$parent.$options.parent.articleComments[this.commentnum]
            .like_count--
        } else {
          await deleteCommentLike(this.Comments.com_id)
          this.$parent.$options.parent.articleComments[
            this.commentnum
          ].is_liking = true
          this.$parent.$options.parent.articleComments[this.commentnum]
            .like_count++
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点击回复
    replyCommets() {
      this.$emit('onReply', this.Comments)
    }
  },
  computed: {
    // 评论时间格式化
    articleCom() {
      const relativeTime = dayjs(this.Comments.pubdate).fromNow()
      return relativeTime
    }
  }
}
</script>

<style lang="less" scoped>
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
