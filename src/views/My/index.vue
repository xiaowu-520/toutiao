<template>
  <div class="my">
    <header>
      <div v-if="isLogin" class="user-info banner">
        <van-row></van-row>
        <van-row class="row-2">
          <van-col span="13">
            <van-row type="flex" align="center" justify="space-around">
              <van-image
                round
                width="1.76rem"
                height="1.76rem"
                :src="userInfo.photo"
              />
              <span class="mobile">{{ userInfo.name }}</span>
            </van-row>
          </van-col>
          <van-col span="10">
            <van-row class="code-row" type="flex" align="center" justify="end">
              <van-button class="code-btn" round size="mini" to="/user"
                >编辑资料</van-button
              >
            </van-row>
          </van-col>
        </van-row>
        <van-row>
          <van-grid class="grid" :border="false">
            <van-grid-item text="头条">
              <template #icon>{{ userInfo.art_count }}</template>
            </van-grid-item>
            <van-grid-item text="粉丝">
              <template #icon>{{ userInfo.fans_count }}</template>
            </van-grid-item>
            <van-grid-item text="关注">
              <template #icon>{{ userInfo.follow_count }}</template>
            </van-grid-item>
            <van-grid-item text="获赞">
              <template #icon>{{ userInfo.like_count }}</template>
            </van-grid-item>
          </van-grid>
        </van-row>
      </div>
      <!-- 未登录头部内容 -->
      <div v-else class="login-register banner">
        <div class="wrap" @click="gologin">
          <img src="../../assets/images/mobile.png" alt="登录" />
          <span>登录 / 注册</span>
        </div>
      </div>
    </header>
    <main>
      <div>
        <van-grid column-num="2" class="grid" clickable>
          <van-grid-item text="收藏">
            <template #icon>
              <span class="iconfont icon-shoucang"></span>
            </template>
          </van-grid-item>
          <van-grid-item text="历史">
            <template #icon>
              <span class="iconfont icon-lishi"></span>
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="link">
        <van-cell title="消息通知" is-link to="" />
        <van-cell title="小智同学" is-link to="" />
      </div>
    </main>
    <van-button
      v-if="isLogin"
      type="default"
      size="large"
      class="login-btn"
      @click="login"
      >退出</van-button
    >
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
export default {
  data() {
    return {
      userInfo: {}
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    isLogin() {
      return !!this.$store.state.user.token
    }
  },
  methods: {
    login() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否退出该账户'
        })
        .then(() => {
          this.$store.commit('setUser', {})
        })
        .catch(() => {})
    },
    gologin() {
      this.$router.push('/login')
    },
    async getUserInfo() {
      if (this.isLogin) {
        try {
          const {
            data: { data }
          } = await getUserInfo()
          this.userInfo = data
        } catch (error) {
          this.$$toast.fail('请重新登录')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my {
  background-color: #f5f7f9;
  height: calc(100vh - 100px);
}
.login-register {
  display: flex;
  justify-content: center;
  align-items: center;
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      font-size: 0.37333rem;
      color: #fff;
      margin-top: 0.13333rem;
    }
    img {
      margin-bottom: 10px;
      width: 1.76rem;
      height: 1.76rem;
    }
  }
}
.banner {
  width: 100%;
  height: 400px;
  background: url('../../assets/images/banner.png') no-repeat 0 0 / cover;
}
.user-info {
  display: flex;
  flex-direction: column;

  > .van-row {
    flex: 1;
  }
  .row-2 {
    .van-col {
      height: 100%;
    }
  }
  .mobile {
    font-size: 0.4rem;
    color: #fff;
  }
  .code-row {
    height: 100%;
  }
  .code-btn {
    width: 1.53333rem;
    height: 0.42667rem;
    background: #fff;
    border-radius: 0.21333rem;
    font-size: 0.26667rem;
    color: #666;
    padding: 0;
  }
  .grid {
    :deep(.van-grid-item__content) {
      background-color: unset;
    }
  }
  :deep(.van-grid-item__icon-wrapper) {
    font-size: 0.34667rem;
    margin-bottom: 0.10667rem;
  }
  .van-grid-item {
    color: #fff;
    :deep(.van-grid-item__text) {
      color: #fff;
    }
  }
}

main {
  .grid {
    color: #646566;
    // 字体图标
    .iconfont {
      font-size: 0.6rem;

      &.icon-lishi {
        color: #ffb31d;
      }
      &.icon-shoucang {
        color: #ed5253;
      }
    }
  }
  .link {
    margin-top: 10px;
  }
}
.login-btn {
  :deep(.van-button__text) {
    color: red;
  }
}
</style>
