<template>
    <div class="count-down-box">
        <div  v-if="isShow" class="show-content">
            <slot />
        </div>
        <div v-else class="count-down">{{ '倒计时：' + formattedTime }}</div>
    </div>
</template>

<script setup lang="ts">
import {ref,toRefs,onMounted,onUnmounted} from "vue";
const props = defineProps({
    targetDate:{
        type:String,
        default:'2049-10-01T00:00:00',
    },
    isShow:{
        type:Boolean,
        default:false,
    }
});
const {targetDate,isShow} = toRefs(props);
const emit = defineEmits(['update:isShow']);
const formattedTime = ref('');
let animationFrameId: number | null = null; // 用于存储动画帧的 ID

const updateCountDown = () => {
    const now = new Date();
    const target = new Date(targetDate.value);
    const timeDiff = target.getTime() - now.getTime();
    if(timeDiff <= 0){
       emit('update:isShow',true);
       if(animationFrameId){
        cancelAnimationFrame(animationFrameId);
       }
    }
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    formattedTime.value = timeDiff > 0 ? `${days}天${hours}时${minutes}分${seconds}秒`:'';
    animationFrameId = requestAnimationFrame(updateCountDown);
}
onMounted(() => {
   animationFrameId =  requestAnimationFrame(updateCountDown);
})
onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
})


</script>

<style scoped lang="scss">
.count-down-box{
  width:100%;
  display:flex;
  justify-content: center;
  align-items: center;
  .count-down{
    font-size:22px;
    text-align:center;
  }
}

</style>
