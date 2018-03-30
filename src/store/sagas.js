//中间件:在action到reducer中添加一些逻辑，监听action触发一个新的action


//redux-saga运用
import {takeEvery,takeLatest} from "redux-saga"//takeLatest只监听最后一次
import {call,put} from "redux-saga/effects"
import $http from "../utils/http";
import {DELIVERY_LIST,DELIVERY_LIST_ERR} from "../store/reducers"
import {getCookie} from ".././utils/utils"
//sage就是generator函数

//worker saga
function* fetchData(){
    //使用call去请求数据,call(fn,param),即fn(param)
    //实现异步转同步
    try{
        let res=yield call($http.post,"/mall/index/getGoodsChannel",{channel_id:3})
        console.log("数据请求成功")
        //saga中代替dispatch来触发action的函数
        yield put({
            type:"TEST_SAGA",
            data:JSON.parse(res)
        })
    }
    catch(err){
        yield put({
            type:"TEST_SAGA_ERROR",
            data:err
        })
    }
    
}

function* fetchDelivery(){
    try{
        let res=yield call($http.post,"/user/Mail/list",{token:getCookie("token")});
        yield put({
            type:DELIVERY_LIST,
            data:res
        })
    }
    catch(err){
        yield put({
            type:DELIVERY_LIST_ERR,
            data:res
        })
    }
}

// function* editDelivery(action){
    
//     try{
//         let res=yield call($http.post,"/user/Mail/editlist",{token:getCookie("token"),index:action.data});
//         yield put({
//             type:"EDIT_DELIVERY_INFO",
//             data:res
//         })
//     }
//     catch(err){
//         yield put({
//             type:"EDIT_DELIVERY_INFO_ERR",
//             data:res
//         })
//     }
// }
//worker saga配合watcher saga使用

function* watchFetch(){
    //监听每一个type为GET_GOODS_LIST的action
    yield takeEvery(["GET_GOODS_LIST"],fetchData)
}

function* watchDelivery(){
    yield takeEvery(["GET_DELIVERY_LIST"],fetchDelivery)
}

// function* watchEditDelivery(){
//     yield takeEvery(["EDIT_DELIVERY"],editDelivery)
// }
export default function* rootSaga(){
    yield [watchFetch(),watchDelivery()]
}