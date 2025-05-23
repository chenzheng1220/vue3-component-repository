<template>
    <div class="largeFileUpload">
        <input type="file" ref="fileRef">
        <button @click="handleUpload">上传</button>
    </div>
</template>

<script setup lang='ts'>
import {ref} from 'vue';
import axios from 'axios';
import WebWorker from './web-worker.ts?worker';
const fileRef = ref<HTMLInputElement | null>(null);
const chunkSize = 1024 * 1024 * 5;//分片大小5M
let allFileChunks: Array<Blob> = []; // 存储所有分片的数组
let hasBeenSplitNum = 0; //记录当前文件已被切分的数量
let allFileChunksIndex = 0;//当前上传的chunk在allFileChunks中的索引
let curConcurrencyNum = 0;//当前并发数量
let maxConcurrencyNum = 6;//最大并发数量
let fileChunks = [];//当前上传的chunk
let worker = null; // web worker 实例

//上传文件
async function handleUpload() {
  // 上传开始前的数据初始化
  allFileChunksIndex = 0
  allFileChunks = []
  hasBeenSplitNum = 0
  curConcurrencyNum = 0
  fileChunks = []

  // 获取文件对象
  const file = fileRef.value.files[0];


  // 获取当前文件已上传的切片列表
  fileChunks = await getFileChunksByFileName(file.name)

  // 实例化 WebWorker，用来做文件切片
   worker = new WebWorker()
  // 将文件切片工作交给 web worker 来完成
  worker.postMessage({ operation: 'splitChunkForFile', file, chunkSize })

  // 总 chunk 数
  const total =  Math.ceil(file.size / chunkSize)

  // 接收 worker 发回的切片（持续发送，worker 每完成一个切片就发一个）
  worker.onmessage = function (e) {
    const { data } = e
    const { operation } = data

    if (operation === 'splitChunkForFile') {
      hasBeenSplitNum += 1
      pushFileChunk(data.file)

      // 说明整个文件已经切完了，释放 worker 实例
      if (hasBeenSplitNum === total) {
        this.terminate()
      }
    }
  }
}

/**
 * 将 worker 完成切片存放到 allFileChunks 中，并触发上传逻辑
 * @param { File } file 文件切片的 File 对象
 */
 function pushFileChunk(file) {
  allFileChunks.push(file)
  uploadChunk()
}

/**
 * 并发上传文件切片，并发数 6（统一域名浏览器最多有 6个并发）
 */
function uploadChunk() {
  if (curConcurrencyNum >= maxConcurrencyNum || allFileChunksIndex >= allFileChunks.length) return

  // 获取文件对象
  const file = fileRef.value.files[0]
  const { name, size } = file
  // 总 chunk 数
  const total =  Math.ceil(size / chunkSize)

  // 从 allFileChunks 中获取指定索引的 fileChunk，这个索引的存在还是为了保证按顺序取和上传 chunk
  const fileChunk = allFileChunks[allFileChunksIndex]

  // 说明当前切片已经上传过了，直接跳过，上传下一个
  if (fileChunks.some(chunkPath => chunkPath.endsWith(fileChunk.name))) {
    console.log(`切片 ${fileChunk.name} 已经上传过了，本次跳过`)
    allFileChunksIndex += 1
    uploadChunk()
    return
  }

  // 并发数 + 1
  curConcurrencyNum += 1

  const formData = new FormData()
  formData.append('file', fileChunk)
  // 标识当前 chunk 属于哪个文件，方便服务端做内容分类和合并，实际场景中这块儿需要考虑唯一性
  formData.append('uuid', name)
  // 标识当前 chunk 是文件的第几个 chunk，即保证 chunk 顺序
  formData.append('index', allFileChunksIndex)
  // 标识总共有多少 chunk，方便服务端判断是否已经接收完所有 chunk
  formData.append('total', total)

  axios.request({
    url: 'http://localhost:3000/uplaod',
    method: 'POST',
    data: formData,
    // 上传进度，这个是通过 XMLHttpRequest 实现的能力
    onUploadProgress: function (progressEvent) {
      // 当前已上传完的大小 / 总大小
      const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log('Upload Progress: ', `${percentage}%`)
    }
  }).then(res => {
    console.log('result = ', res.data)
  }).finally(() => {
    /**
     * 当前请求完成，
     */
    // 并发数 - 1
    curConcurrencyNum -= 1
    // 上传下一个切片
    uploadChunk()
  })

  // 更新 chunk 索引，方便取下一个 chunk
  allFileChunksIndex += 1

  uploadChunk()
}

/**
 * 获取文件已上传的切片
 * @param { string } fileName 文件名
 */
async function getFileChunksByFileName(fileName) {
  const { data } = await axios.request({
    url: 'http://localhost:3000/get-file-chunks-by-uuid',
    method: 'GET',
    params: {
      uuid: fileName
    }
  })
  return data
}


</script>

<style scoped lang='scss'>
.largeFileUpload{

}
</style>