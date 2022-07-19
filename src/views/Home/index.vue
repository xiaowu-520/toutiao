<template>
  <div>
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round><van-icon name="search" />搜索</van-button>
      </template>
    </van-nav-bar>
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in MyChannels" :key="item.id" :title="item.name">
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>
      <span class="iconfont icon-gengduo" @click="showPopup"></span>
    </van-tabs>
    <!-- 弹出框 -->
    <ChannelPopup
      ref="popup"
      :MyChannels="MyChannels"
      @del-channel="delChannel"
      @change-active="ChangeActive"
      @add-channel="AddChannel"
    ></ChannelPopup>
  </div>
</template>

<script>
import {
  getMyChannels,
  delMyChannel,
  getMyChannelsByLocal,
  setMyChannelsToLocal,
  addMyChannel
} from '@/api/channel'
import ArticleList from './component/ArticleList.vue'
import ChannelPopup from './component/channelPopup'
export default {
  data() {
    return {
      active: 0,
      MyChannels: [],
      show: false
    }
  },
  components: {
    ArticleList,
    ChannelPopup
  },
  created() {
    this.getMyChannels()
  },
  computed: {
    isLogin() {
      return !!this.$store.state.user.token
    }
  },
  methods: {
    async getMyChannels() {
      try {
        if (!this.isLogin) {
          const MyChannels = await getMyChannelsByLocal()
          if (MyChannels) {
            this.MyChannels = MyChannels
          } else {
            const { data } = await getMyChannels()
            this.MyChannels = data.data.channels
          }
        } else {
          // 如果是登录状态
        }
      } catch (error) {
        this.$toast.fail('请重新获取数据')
      }
    },
    showPopup() {
      this.$refs.popup.show = true
    },
    // 筛选数组,删除频道
    async delChannel(id) {
      this.MyChannels = this.MyChannels.filter((item) => item.id !== id)
      if (!this.isLogin) {
        setMyChannelsToLocal(this.MyChannels)
      } else {
        try {
          await delMyChannel(id)
        } catch (error) {
          this.$toast.fail('删除失败')
        }
      }
      this.$toast.success('删除成功')
    },
    // 点击跳转
    ChangeActive(active) {
      this.active = active
    },
    async AddMyChannel(channel) {
      // 添加频道
      this.MyChannels.push(channel)
      if (!this.isLogin) {
        setMyChannelsToLocal(this.MyChannels)
      } else {
        try {
          await addMyChannel(channel.id, this.MyChannels.length)
        } catch (error) {
          return this.$toast.fail('添加失败')
        }
      }
      this.$toast.success('添加成功')
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}
//tabs选项卡
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.icon-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 99;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
// 头部固定的样式
.navbar {
  position: sticky;
  top: 0;
  left: 0;
}
:deep(.van-tabs__wrap) {
  position: sticky;
  top: 92px;
  left: 0;
  z-index: 99;
}
.icon-gengduo {
  position: fixed;
  top: 92px;
}

:deep(.van-tabs__content) {
  max-height: calc(100vh - 92px - 82px - 100px);
  overflow: auto;
}
</style>
