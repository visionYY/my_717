//购物车功能组件
import React,{Component,PureComponent} from "react"
import {connect} from "react-redux"//用挂载的数据
import mapStateToProps from "./state"
import mapDispatchToProps from "./dispatch"
import "./cart.less"
import CartItem from "../../components/cartItem/cartItem"
class Cart extends PureComponent{
    constructor(){
        super()
        this.state={
            str:"all",
            edit:"编辑",
            pay:"结算"
        }
        this.cartEdit=this.cartEdit.bind(this)
        this.toDelGoods=this.toDelGoods.bind(this)
    }
    render(){
        let {str,edit,pay}=this.state;
        let {cartList,totalCost,selectAll,toggleSelectAll}=this.props
        return (
            <div id="cart">
                <header>购物车<span className="edit" onClick={this.cartEdit}>{edit}</span></header>
                <div className="goods_list">
                    <ul>
                        {
                            cartList.map((item,index)=>{
                               return <CartItem key={"cartItem"+index} item={item}></CartItem>
                           })
                       }
                    </ul>
                </div> 
                <footer>
                    <div onClick={()=>{//函数作用域
                        this.setState({
                            str:str==="all"?"none":"all"
                        });
                        toggleSelectAll(str)
                    }}>全选<span className={'select-btn iconfont '+(selectAll?'icon-select':'')}></span></div>
                    <div>总价<span>{totalCost}</span><span className="cart-btn" onClick={this.toDelGoods}>{pay}</span></div>
                </footer>
            </div>
        )
    }
    cartEdit(){
        this.setState({
            edit:this.state.edit=="编辑"?"完成":"编辑",
            pay:this.state.edit=="编辑"?"删除":"结算"
        })
    }
    toDelGoods(){//在购物车中删除选中的商品
        if(this.state.pay=="结算")return;
        let selectID=[];
        this.props.cartList.forEach((item)=>{
            if(item.select==1){
                selectID.push(item.goods_id)
            }
        })
        this.props.delCartGoods(selectID)
    }
    componentDidMount(){
        this.props.fetchGoodsList(this.props.history)
    }
    
}
export default connect(mapStateToProps,mapDispatchToProps)(Cart)