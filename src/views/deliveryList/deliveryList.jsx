import React,{Component} from "react"
import Header from "../../components/header"
import Button from "../../components/button"
import $http from "../../utils/http"
import {getCookie} from "../../utils/utils"
import Loading from "../../components/notify"
import {connect} from "react-redux"
import mapStateToProps from "./state"
import mapDispatchToProps from "./dispatch"
import "./deliveryList.less"
class DeliveryList extends Component{
    constructor(){
        super()
        this.toConsignee=this.toConsignee.bind(this)
    }
    render(){
        let {history,deliveryList}=this.props
        return (
            <div id="delivery">
                <header>
                    <Header history={history}><h1>收货地址</h1></Header>
                </header>
                <section>
                   {
                        deliveryList.length==0?<p>目前没有邮寄地址信息</p>:
                        <ul>
                            {
                                deliveryList.map((item,index)=>{
                                    return (
                                        <li key={index}>
                                            <p>{item.name+""+item.phone}</p>
                                            <p>{item.province+item.city+item.region}</p>
                                            <div><span onClick={()=>{this.toEdit(index)}}>编辑</span><span onClick={()=>{this.toDelete(index)}}>删除</span></div>
                                        </li>
                                    )
                                    
                                })
                            }
                        </ul>
                    } 
                </section>
                <Button onClick={this.toConsignee}><span className="iconfont icon-select"></span>添加地址</Button>
                <Loading container="#delivery" type="loading" ref="loading"></Loading>
            </div>
           
        )
    }
    toEdit(index){
        this.props.toEditDelivery(index)
    }
    toDelete(index){

    }
    toConsignee(){
        this.props.history.push("/consignee")
    }
    // componentWillMount(){
        
    // }
    componentDidMount(){
        this.props.getDelivery()
        this.refs.loading.mountNotify()
    }
    componentDidUpdate(){
        if(this.props.deliveryList.length>0){
            this.refs.loading.unMountNotify()
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(DeliveryList)