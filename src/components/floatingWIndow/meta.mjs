export default {
    type: 'web',
    description: '飘窗组件',
    props:{
        width:{
            label:'飘窗宽度',
            type:Number,
            default:100
        },
        height:{
            label:'飘窗高度',
            type:Number,
            default:100
        },
        speedx:{
            label:'飘窗X轴速度',
            type:Number,
            default:1
        },
        speedy:{
            label:'飘窗Y轴速度',
            type:Number,
            default:1
        },
        imgSrc:{
            label:'飘窗图片链接',
            type:String,
            default:''
        }
    }
}