

<template>
  <div class="wrapper">
    <countDown targetDate="2049-10-01T00:00:00" :isShow=isShow @update:isShow="isShow = $event">
      展示内容
    </countDown>

    <largeFileUpload />

    <floatingWindow
      :width="100"
      :height="100"
      :speedX="2"
      :speedY="2"
      />

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import countDown from "./components/countDown/index.vue";
import largeFileUpload from "./components/largeFileUpload/index.vue";
import floatingWindow from "./components/floatingWindow/index.vue";
const isShow = ref(false);

</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  >div{
    margin:12px auto;
  }
}

</style>
