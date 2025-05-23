<template>
    <div class="floating-box" 
    ref="floatingBoxRef"
    :style="{width:`${width}px`,height:`${height}px`,top: `${position.y}px`, left: `${position.x}px` }"
    @mouseenter="pauseAnimation"
    @mouseleave="resumeAnimation"
    >
        <img v-if="imgSrc" :src="imgSrc" alt="" style="width:100%;height:100%;object-fit:cover">
    </div>
</template>

<script setup lang='ts'>
import {ref,reactive,onMounted,onUnmounted} from 'vue';
const props = defineProps({
    width:{
        type:Number,
        default:100,
    },
    height:{
        type:Number,
        default:100,
    },
    speedX:{
        type:Number,
        default:2,
    },
    speedY:{
        type:Number,
        default:2, 
    },
    imgSrc:{
        type:String,
        default:'',
    }
})

const floatingBoxRef = ref<HTMLElement | null>(null);
const position = reactive({
    x: 0,
    y: 0,
});
const speed = reactive({
    x: props.speedX,
    y: props.speedY,
})
const isPaused = ref(false);
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

const updatePosition = () => {
    if(!isPaused.value){
        position.x += speed.x;
        position.y += speed.y;

        if(position.x <= 0 || position.x >= viewportWidth - props.width){
            speed.x = -speed.x;
        }

        if(position.y <= 0 || position.y >= viewportHeight - props.height){
            speed.y = -speed.y;
        }
    }
    requestAnimationFrame(updatePosition);
}

const pauseAnimation = () => {
    isPaused.value = true;
}

const resumeAnimation = () => {
    isPaused.value = false;
    
}

const handleResize = () => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
}

onMounted(() => {
   window.addEventListener('resize',handleResize);
   updatePosition(); 
})

onUnmounted(() => {
    window.removeEventListener('resize',handleResize);
})



</script>

<style scoped lang="scss">
.floating-box{
  position:fixed;
  z-index:999;
  background-color:red;     
  cursor:pointer;
}

</style>