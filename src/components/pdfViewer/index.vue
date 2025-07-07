<template>
  <div class="pdf-viewer">

    <div class="canvas-container" ref="pdfContainer"></div>
    <div class="controls">
      <button @click="prevPage" :disabled="pageNum <= 1">上一页</button>
      <span>第 {{ pageNum }} 页 / 共 {{ pageCount }} 页</span>
      <button @click="nextPage" :disabled="pageNum >= pageCount">下一页</button>
      <input
        type="range"
        v-model="zoom"
        min="150"
        max="200"
        step="10"
      >
      <span>{{ zoom }}%</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted,toRefs } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  }
});
const { pdfUrl } = toRefs(props);
console.log(pdfUrl.value);
const pdfContainer = ref(null);
const pageNum = ref(1);
const pageCount = ref(0);
const zoom = ref(150);
let pdfDoc = null;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const renderPage = async (num) => {
  if (!pdfDoc) return;

  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: zoom.value / 100 });

  pdfContainer.value.innerHTML = '';

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  pdfContainer.value.appendChild(canvas);

  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;
};
watch(pdfUrl, (newVal) => {
  loadPdf();
  pageNum.value = 1
});
const loadPdf = async () => {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfUrl.value);
    pdfDoc = await loadingTask.promise;
    pageCount.value = pdfDoc.numPages;
    await renderPage(pageNum.value);
  } catch (err) {
    console.error('PDF加载失败:', err);
  }
};

const prevPage = () => {
  if (pageNum.value > 1) pageNum.value--;
};

const nextPage = () => {
  if (pageNum.value < pageCount.value) pageNum.value++;
};

watch(pageNum, (newVal) => {
  renderPage(newVal);
});

watch(zoom, () => {
  renderPage(pageNum.value);
});

onMounted(() => {
  loadPdf();
});

onUnmounted(() => {
  if (pdfDoc) pdfDoc.destroy();
});
</script>

<style scoped lang="scss">
.pdf-viewer {
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
}

.controls {
  display: flex;
  align-items: center;
  justify-content:center;
  gap: 10px;
  margin-bottom: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.canvas-container {
  overflow: auto;
  border: 1px solid #ddd;
  pointer-events: none;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
