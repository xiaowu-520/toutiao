<template>
  <div class="update-avatar">
    <img :src="photo" ref="img" style="width: '100%'" />
    <div class="toolbar">
      <span class="cancel" @click="$parent.$parent.PtoShow = false">取消</span>
      <span class="confirm" @click="PtoConfirm">完成</span>
    </div>
  </div>
</template>

<script>
import { userPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  data() {
    return {
      MyCropper: ''
    }
  },
  props: ['photo'],
  mounted() {
    this.MyCropper = new Cropper(this.$refs.img, {})
  },
  methods: {
    // 上传图片
    async PtoConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0
      })
      const formData = new FormData()
      this.MyCropper.getCroppedCanvas().toBlob(async (blob) => {
        formData.append('photo', blob)
        try {
          await userPhoto(formData)
          // 关闭弹层，更新视图
          this.$parent.$parent.PtoShow = false
          this.$toast('更新成功')
          this.$parent.$parent.getMyInfo()
        } catch (err) {
          this.$toast('更新失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.update-avatar {
  background: #000;
  width: 100%;
  height: 100%;
  .toolbar {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
