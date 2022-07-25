<template>
  <div class="MyInfo">
    <div class="navbar">
      <van-nav-bar title="个人信息" left-arrow @click-left="ClickBack" />
    </div>
    <input type="file" hidden ref="file" accept=".png,.jpg" />
    <!-- 头像 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <template #default>
        <van-image round width="0.8rem" height="0.8rem" :src="MyInfo.photo" />
      </template>
    </van-cell>
    <!-- 昵称 -->
    <van-cell
      title="昵称"
      is-link
      :value="MyInfo.name"
      @click="NameShow = true"
    >
    </van-cell>
    <!-- 性别 -->
    <van-cell
      title="性别"
      is-link
      :value="['男', '女'][MyInfo.gender]"
      @click="SexShow = true"
    >
    </van-cell>
    <!-- 生日 -->
    <van-cell title="生日" is-link @click="BdShow = true">
      <template #default>
        <span>{{ MyInfo.birthday }}</span>
      </template>
    </van-cell>
    <!-- 昵称弹出层 -->
    <van-popup v-model="NameShow" position="bottom" :style="{ height: '100%' }">
      <van-nav-bar
        title="更新昵称"
        left-text="取消"
        right-text="保存"
        @click-left="onNameLeft"
        @click-right="onNameRight"
      />
      <van-field
        v-model="NameInfo"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="输入新的昵称"
        show-word-limit
      />
    </van-popup>
    <!-- 性别弹出层 -->
    <van-popup v-model="SexShow" position="bottom" :style="{ height: '40%' }">
      <van-picker
        title="更新性别"
        show-toolbar
        :columns="SexList"
        @confirm="onSexConfirm"
        @cancel="onSexCancel"
      />
    </van-popup>
    <!-- 生日弹出层 -->
    <van-popup v-model="BdShow" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onBdConfirm"
        @cancel="onBdCancel"
      />
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup
      v-model="PtoShow"
      position="bottom"
      :style="{ height: '100%', width: '100%' }"
    >
      <MyPhoto v-if="PtoShow" :photo="photo" />
    </van-popup>
  </div>
</template>

<script>
import { getMyInfo, editMyInfo } from '@/api/user'
import dayjs from '@/utils/dayjs'
import MyPhoto from './components/MyPhoto.vue'
export default {
  data() {
    return {
      MyInfo: {},
      NameShow: false,
      NameInfo: '',
      SexShow: false,
      SexList: ['男', '女'],
      BdShow: false,
      minDate: new Date(1949, 0, 1),
      maxDate: new Date(2030, 10, 1),
      currentDate: new Date(2022, 6, 25),
      PtoShow: false,
      photo: ''
    }
  },
  created() {
    this.getMyInfo()
  },
  components: {
    MyPhoto
  },
  // 获取cropper实例
  mounted() {
    this.$refs.file.addEventListener('change', (e) => {
      const file = e.target.files[0]
      //  file = URL.createObjectURL(file) // 将file对象转换成图片可识别的url
      const fr = new FileReader() // 文件阅读器
      fr.readAsDataURL(file) // 转 base64
      fr.onload = (e) => {
        // onload 读取完成后触发
        this.photo = e.target.result // 转base64后的结果
        this.PtoShow = true
      }
    })
  },
  methods: {
    ClickBack() {
      this.$router.back()
    },
    // 获取用户资料
    async getMyInfo() {
      try {
        const { data } = await getMyInfo()
        this.MyInfo = data.data
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑昵称弹出层
    onNameLeft() {
      this.NameShow = false
    },
    async onNameRight() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        if (this.NameInfo.trim() === '') return this.$toast('请输入昵称')
        await editMyInfo({ name: this.NameInfo })
        this.$toast('更新成功')
        this.getMyInfo()
      } catch (error) {
        if (error.response && error.response.status === 409) {
          return this.$toast.success('用户名已存在')
        }
        this.$toast.fail('更新失败')
      }
      this.NameShow = false
    },
    // 性别弹出层
    async onSexConfirm(value) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      const index = value === '男' ? 0 : 1
      try {
        await editMyInfo({
          gender: index
        })
        this.getMyInfo()
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast('更新失败')
      }
      this.SexShow = false
    },
    onSexCancel() {
      this.SexShow = false
    },
    // 生日弹出层
    async onBdConfirm(value) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        await editMyInfo({
          birthday: dayjs(value).format('YYYY-MM-DD')
        })
        this.getMyInfo()
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast('更新失败')
      }
      this.BdShow = false
    },
    onBdCancel() {
      this.BdShow = false
    }
    // 获取上传文件信息
    // onFileChange() {
    //   // 获取文件对象
    //   const file = this.$refs.file.files[0]
    //   // 获取blob数据
    //   this.imgUrl = window.URL.createObjectURL(file)
    //   this.PtoShow = true
    //   // 同一张图片，change事件不会触发
    //   this.$refs.file.value = ''
    //   console.log(this.imgUrl)
    // },
  }
}
</script>

<style lang="less" scoped>
.navbar {
  .van-nav-bar {
    background-color: #3296fa;
    color: #fff;
  }
  :deep(.van-nav-bar__left .van-icon) {
    color: #fff;
  }
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
}
</style>
