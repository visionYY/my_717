//退出登录
import React,{Component} from "react"
import {loginout} from "../../utils/utils"
import Dialog from '../../components/dialog/dialog'
let img1 = require('../../static/img/b.png')
class Setting extends Component{
    constructor(){
        super()
        this.loginout=this.loginout.bind(this)
        this.Back=this.Back.bind(this)
        this.state={
            flag:false
        }
    }
    render(){
        return (
            <div id="setting">
                <header>
                <i className="iconfont icon-shezhi" onClick={this.Back}></i>
                <p>设置</p>
            </header>
            <section>
                <p><a href="#">我的头像</a><a href="#"><img src={img1} alt=""/></a></p>
                <p><a href="#">用户名</a><a href="#">马妍</a></p>
                <p><a href="#">二维码</a><i className="iconfont icon-wodedianpu"></i></p>
                <h4 onClick={this.loginout}>退出登录</h4>
                {
                    this.state.flag&&<Dialog loginout={loginOut} history={this.props} confirm={'确认'} cancel={'取消'}/>
                }
            </section>
            </div>     
        )
    }
    loginout(){
        loginout()
        this.props.history.push('/index/home')
        this.setState({
            flag:true
        })
        let dialog_bg = document.querySelector('.dialog_bg')
        dialog_bg!=null?dialog.className='dialog_bg':''
    }
    Back(){
        this.props.history.push('/index/mine')
    }
}
export default Setting