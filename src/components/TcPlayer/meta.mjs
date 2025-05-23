export default{
    type:'web',
    description:'视频直播组件',
    props:{
        videoUrl:{
            label:'视频链接',
            type:String,
            default:'',
        },
        videoCoverUrl:{
            label:'视频封面链接',
            type:String,
            default:'',
        } 
    }
}