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

      <pdfViewer
        pdfUrl="https://webapp.zhaopin.com/2025/bf/bjczt0606ZL85165/23.保密办-主任-岗位说明书（公开）.pdf"
        />

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import countDown from "./components/countDown/index.vue";
import largeFileUpload from "./components/largeFileUpload/index.vue";
import floatingWindow from "./components/floatingWindow/index.vue";
import pdfViewer from "./components/pdfViewer/index.vue";
const isShow = ref(false);

</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  >div{
    width:100%;
    margin:12px auto;
    border:1px dashed #ccc;
    padding:30px;
    text-align: center;
  }
}

</style>
