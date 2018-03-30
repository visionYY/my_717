//添加邮寄地址
import React,{Component} from "react"
import propTypes from "prop-types"
import Header from "../../components/header"
import Button from "../../components/button"
import $http from "../../utils/http"
import "./consignee.less"
import {getCookie} from "../../utils/utils"
import Notify from "../../components/notify"
import {connect} from "react-redux"
//封装表单
class Input extends Component{
    constructor(){
        super()
        this.getVal=this.getVal.bind(this)
    }
    render(){
        return (
            <input type="text" onChange={this.getVal} placeholder={this.props.placeholder}/>//这个onChange才是onChange函数
        )
    }
    getVal(e){
        this.props.onChange(e.target.value)
    }
}
//使用prop-types类型检查
Input.propTypes={
    onChange:propTypes.func.isRequired
}
//封装select组件
class Select extends Component{
    constructor(){
        super()
        this.getVal=this.getVal.bind(this)
    }
    render(){
        return (
            <select name="" id="" onChange={this.getVal}>
                <option value="北京">北京</option>
                <option value="上海">上海</option>
                <option value="天津">天津</option>
                <option value="内蒙">内蒙</option>
                <option value="重庆">重庆</option>
            </select>
        )
    }
    getVal(e){
        this.props.onChange(e.target.value)
    }
}
Select.propTypes={
    onChange:propTypes.func.isRequired
}
class Consignee extends Component{
    constructor(){
        super()
        this.toSave=this.toSave.bind(this)
        this.inputChange=this.inputChange.bind(this)
        this.name=''//存储姓名
        this.phone=''//存储电话
        this.address=''//存储地址
    }
    render(){
        let {editInfo}=this.props
        console.log(editInfo)
        return <div id="consignee">
            <Header history={this.props.history}><h1>添加邮寄地址</h1></Header>
            <section>
                {/* 这个onChange是属性传给input组件 */}
                <Input placeholder="收货人姓名" onChange={(val)=>{this.inputChange("name",val)}}></Input>
                <Input placeholder="手机号" onChange={(val)=>{this.inputChange("phone",val)}}></Input>
                <Select  onChange={(val)=>{this.inputChange("province",val)}}></Select>
                <Select  onChange={(val)=>{this.inputChange("city",val)}}></Select>
                <Select  onChange={(val)=>{this.inputChange("region",val)}}></Select>
                <Input placeholder="详细地址" onChange={(val)=>{this.inputChange("address",val)}}></Input>
                
            </section>
            <Button onClick={this.toSave}>保存</Button>
            <Notify container="#consignee" ref="tips"></Notify>
        </div>
    }
    inputChange(a,b){
        this[a]=b
    }
    toSave(){
        console.log("去保存新的邮寄地址")
        console.log(this.name)
        console.log(this.phone)
        console.log(this.address)
        let reg_exp_name=/([A-Za-z\d\u4e00-\u9fa5]+)$/g;
        let reg_exp_phone=/^1[3578]\d{9}$/;
        let {tips}=this.refs
        if(!reg_exp_name.test(this.name)){
            tips.mountNotify("请输入用户名")
            return;
        }
        if(!reg_exp_phone.test(this.phone)){
            tips.mountNotify("请输入手机号")
            return;
        }
        if(!this.province || !this.city || !this.region){
            tips.mountNotify("请选择省市区")
            return;
        }
        if(!this.address){
            tips.mountNotify("请填写街道")
            return;
        }
        $http.post("/user/Mail/addNew",{//请求新加地址接口获取数据
            name:this.name,
            phone:this.phone,
            province:this.province,
            city:this.city,
            region:this.region,
            address:this.address,
            token:getCookie("token")
        }).then((res)=>{
            if(res.success==1){
                this.props.history.replace("/deliverylist")//添加成功后回退到deliverylist
            }
        })
    }
}
export default connect(function(state){
    return {
        editInfo:state.edit_info
    }
})(Consignee)