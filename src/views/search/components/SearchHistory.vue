<template>
  <div>
    <van-cell-group>
      <van-cell title="搜索历史" value="内容">
        <template #default v-if="isShow">
          <span @click="delAll">全部删除</span>&nbsp;&nbsp;
          <span @click="isShow = false">完成</span>
        </template>
        <template #default v-else>
          <span class="iconfont icon-shanchu" @click="isShow = true"></span>
        </template>
      </van-cell>
      <van-cell
        :title="item"
        v-for="(item, index) in historys"
        :key="index"
        @click.stop="delHistory(item, index)"
      >
        <template #default>
          <span class="iconfont icon-shanchu" v-if="isShow"></span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    }
  },
  props: {
    historys: {
      type: Array,
      required: true
    }
  },
  methods: {
    delHistory(item, index) {
      if (this.isShow) {
        this.$parent.historys.splice(index, 1)
      } else {
        this.$parent.value = item
        this.$emit('search', item)
      }
    },
    delAll() {
      this.$parent.historys = []
    }
  }
}
</script>

<style></style>
