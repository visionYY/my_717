//请求数据前端
import $http from "../../utils/http"
import {getCookie} from "../../utils/utils"
import {UPDATE_GOODS_LIST,SELECTED_ALL} from "../../store/reducers"
export default function mapDispatchToProps(dispatch){
    return {
        fetchGoodsList(history){ 
            $http.post("/user/Cart/goodsList",{
                token:getCookie("token")
            })
            .then(res=>{
                console.log(res)
                if(res.error==1){
                    console.log(history)
                    history.push("/login",{
                        from:"/index/cart"
                    })
                 }else{
                    dispatch({
                        type:UPDATE_GOODS_LIST,
                        data:res
                    })
                 }
            })
        },
        toggleSelectAll(str){
            dispatch({
                type:SELECTED_ALL,
                data:str//全选非全选
            })
        },
        delCartGoods(selectID){
            $http.post("/user/Cart/delGoods",{
                selectID,
                token:getCookie("token")
            })
            .then(res=>{
                if(res.success==1){//请求成功更新整个商品列表放到leftGoods
                    dispatch({
                        type:UPDATE_GOODS_LIST,
                        data:res.leftGoods
                    })
                }
            })
        }
    }
}