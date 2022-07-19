<template>
  <div>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="popupMain">
        <div class="myChannel">
          <van-cell title="我的频道">
            <van-button
              size="small"
              round
              class="edit-btn"
              @click="isEdit = !isEdit"
              >编辑</van-button
            >
          </van-cell>
          <van-grid gutter="10" :border="false">
            <van-grid-item
              v-for="(item, index) in MyChannels"
              :key="item.id"
              :text="item.name"
              :class="{ activeChannel: item.name === '推荐' }"
              @click="onClickChannel(item, index)"
            >
              <template #icon
                ><van-icon v-show="isEdit && item.name !== '推荐'" name="cross"
              /></template>
            </van-grid-item>
          </van-grid>
        </div>
        <div class="recommendChannel">
          <van-cell title="推荐频道"></van-cell>
          <van-grid :border="false" gutter="10" direction="horizontal">
            <van-grid-item
              v-for="item in recommendChannels"
              :key="item.id"
              :text="item.name"
              icon="plus"
              @click="addChannel(item)"
            ></van-grid-item>
          </van-grid>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  data() {
    return {
      show: false,
      allChannels: [],
      isEdit: false
    }
  },
  props: {
    MyChannels: {
      type: Array
    }
  },
  created() {
    this.getAllChannels()
  },
  methods: {
    async getAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 点击删除
    onClickChannel(channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        return this.$emit('del-channel', channel.id)
      }
      // 点击跳转
      if (!this.isEdit) {
        this.show = false
        this.$emit('change-active', index)
      }
    },
    // 点击添加
    addChannel(channel) {
      this.$emit('add-channel', { ...channel })
    }
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter((item) => {
        return !this.MyChannels.find((i) => i.id === item.id)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.popupMain {
  padding-top: 100px;
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 0.02667rem solid red;
  }
  .myChannel {
    :deep(.van-grid-item__content) {
      position: relative;
      background: #f4f5f6;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;

        .van-icon-cross {
          font-size: 20px;
          position: absolute;
          top: -0.14rem rem;
          right: 0.06667rem;
          position: absolute;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          //   line-height: 0.32rem;
        }
      }
    }
  }
  .recommendChannel {
    :deep(.van-icon) {
      font-size: 0.5rem;
    }
    :deep(.van-grid-item__content) {
      background: #f4f5f6;
    }
  }
}

.activeChannel {
  :deep(.van-grid-item__text) {
    color: #ff69b4;
  }
}
</style>
