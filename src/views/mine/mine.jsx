//我的页面
import React,{Component} from "react"
import {connect} from "react-redux"
import mapStateToProps from "./state"
import "./mine.less"
class Mine extends Component{
    constructor(){
        super()
        this.Setting=this.Setting.bind(this)
        this.toDeliveryList=this.toDeliveryList.bind(this)
    }
    render(){
        let {userInfo}=this.props
        return (
            <div id="mine">
                <header>
                    <p><span className="iconfont icon-setting" onClick={this.Setting}></span><span>我的717商城</span></p>
                </header>
                <section className="user-info">
                    <dl>
                        <dt>
                            <img src={require("../../static/img/1.png")} alt=""/>
                        </dt>
                        <dd>
                            <p>{userInfo.name}</p>
                            <p>{userInfo.nickName}</p>
                        </dd>
                    </dl>
                </section>
                <section className="account-manage">
                    <ul>
                        <li>
                            <span className="iconfont icon-shanchu"></span>
                            <p>
                                <span className="title">账户管理</span>
                                <span className="iconfont icon-right-arrow"></span>
                            </p>
                        </li>
                        <li>
                            <span className="iconfont icon-shanchu"></span>
                            <p onClick={this.toDeliveryList}>
                                <span className="title">地址管理</span>
                                <span className="iconfont icon-right-arrow"></span>
                            </p>
                        </li>
                        <li>
                            <span className="iconfont icon-shanchu"></span>
                            <p>
                                <span className="title">联系客服</span>
                                <span className="iconfont icon-right-arrow"></span>
                            </p>
                        </li>
                    </ul>
                </section>
            </div>
        )
    }
    Setting(){
        this.props.history.push("/setting")
    }
    toDeliveryList(){
        this.props.history.push("/deliveryList")
    }
}
export default connect(mapStateToProps)(Mine)//取Store里面信息