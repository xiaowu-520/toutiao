<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      class="navbar"
      title="登录"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>
    <!-- 表单 -->
    <van-form ref="form" @submit="login" class="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <template #label>
          <span class="iconfont icon-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #label>
          <span class="iconfont icon-yanzhengma"></span>
        </template>
        <template #button>
          <van-count-down
            :time="3 * 1000"
            v-if="isShow"
            @finish="isShow = false"
          />
          <van-button
            v-else
            round
            size="mini"
            class="mbtn"
            @click.prevent="sendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user'
import { mobileRules, codeRules } from './rules'
export default {
  name: 'MyLogin',
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShow: false
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    async login() {
      this.$toast.loading({
        message: 'loading....',
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        this.$store.commit('setUser', res.data.data)
        this.$router.push('/profile')
        console.log(res)
        this.$toast.success('登录成功')
      } catch (error) {
        const status = error.response.status
        let message = '服务端错误'
        if (status === 400) {
          message = error.response.data.message
        }
        this.$toast.fail(message)
        // switch (status) {
        //   case 400:
        //     this.$toast.fail(error.response.data.message)
        //     break
        //   case 507:
        //     this.$toast.fail('登录错误~请刷新')
        //     break
        //   default:
        //     this.$toast.fail('登录错误~请刷新')
        //     break
        // }
      }
    },
    async sendCode() {
      try {
        await this.$refs.form.validate('mobile')
        await sendCode(this.mobile)
        this.isShow = true
      } catch (error) {
        const status = error.response.status
        if (status === 404 || status === 429) {
          this.$toast.fail(error.response.data.message)
        } else {
          this.$toast.fail('非法手机号')
        }
      }
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
