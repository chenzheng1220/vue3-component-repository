<template>
    <div class="TcPlayer">
        <video id="player-container-id">

        </video>

    </div>
</template>

<script setup lang="ts">
import TCPlayer from 'tcplayer.js';
import 'tcplayer.js/dist/tcplayer.min.css';
import {ref,reactive,toRefs,onMounted} from 'vue';
const props = defineProps({
    videoUrl:{
        type:String,
        default:'',
    },
    videoCoverUrl:{
        type:String,
        default:'',
    }
})
const {videoUrl,videoCoverUrl} = toRefs(props);
// 初始化video  
onMounted(() => {
    const player = TCPlayer('player-container-id', {
    sources: [{
      src: videoUrl.value, // 播放地址
      poster: videoCoverUrl.value, // 视频封面地址
    }],
});
})
</script>

<style scoped lang='scss'>
.TcPlayer {
    width: 100%;
    height: 100%;
    position: relative;
    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>