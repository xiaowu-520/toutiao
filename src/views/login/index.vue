<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar class="navbar" title="登录" left-arrow>
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <!-- 表单 -->
    <van-form @submit="login" class="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="[{ required: true, message: '请输入手机号' }]"
      >
        <template #label>
          <span class="iconfont icon-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <template #label>
          <span class="iconfont icon-yanzhengma"></span>
        </template>
        <template #button>
          <van-button round size="mini" class="mbtn">发送验证码</van-button>
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'MyLogin',
  data() {
    return {
      mobile: '',
      code: ''
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    async login() {
      const res = await login(this.mobile, this.code)
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: cornflowerblue;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}

.form {
  :deep(.van-field__value) {
    flex: 20;
  }
  :deep(.van-field__label) {
    flex: 1;
  }
  .iconfont {
    font-size: 0.5rem;
  }
  .van-button--info {
    background-color: cornflowerblue;
    border: 0.02667rem solid cornflowerblue;
  }
  .mbtn {
    background-color: #eee;
    color: #666;
    padding: 0 10px;
  }
}
</style>
