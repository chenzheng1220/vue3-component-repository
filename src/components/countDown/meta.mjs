export default {
  type: 'web',
  description: '倒计时组件',
  props:{
    targetDate:{
          label:'目标时间',
          type:String,
          default:'2049-10-01T00:00:00'
      },
      isShowContent:{
          label:'是否显示内容',
          type:Boolean,
          default:false
      }
  }
}
