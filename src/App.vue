<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  created() {
    console.dir(request)
  }
}
</script>

<style></style>
