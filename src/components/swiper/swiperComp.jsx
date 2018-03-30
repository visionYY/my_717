import React,{Component} from "react"
import Swiper from "swiper"
import "swiper/dist/css/swiper.css"
let img1=require('../../static/img/1.png')//这样引用webpack可以打包
class SwiperComponent extends Component{
    render(){
        return <div className="swiper-container" ref="scDom">
            <div className="swiper-wrapper">
                <div className="swiper-slide"><img src={img1}/></div>
                <div className="swiper-slide"><img src={require('../../static/img/2.png')}/></div>
                <div className="swiper-slide"><img src={require('../../static/img/3.png')}/></div>
                <div className="swiper-slide"><img src={require('../../static/img/4.png')}/></div>
            </div>
        </div>
    }
    componentDidMount(){
        new Swiper(this.refs.scDom,{
            autoplay:true,
            loop:true
        })
    }
}
export default SwiperComponent