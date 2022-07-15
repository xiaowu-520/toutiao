<template>
  <div>
    <router-view></router-view>
    <div>
      <van-tabbar route>
        <van-tabbar-item replace to="/home">
          <span>首页</span>
          <template #icon>
            <span class="iconfont icon-shouye"></span>
          </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/video">
          <span>视频</span>
          <template #icon>
            <span class="iconfont icon-shipin"></span>
          </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/qa">
          <span>问答</span>
          <template #icon>
            <span class="iconfont icon-wenda"></span>
          </template>
        </van-tabbar-item>
        <van-tabbar-item replace to="/profile">
          <span>我的</span>
          <template #icon>
            <span class="iconfont icon-wode"></span>
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
:deep(.van-tabbar) {
  .van-tabbar-item__text {
    font-size: 24px;
  }
  .iconfont {
    font-size: 36px;
  }
}
</style>
