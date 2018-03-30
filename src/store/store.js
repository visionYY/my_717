import {createStore,applyMiddleware} from "redux"
import logger from "redux-logger"
import reducers from "./reducers"
import sagas from "./sagas"
import createSagaMiddleware from "redux-saga"
//创建sage在applyMiddleware中执行sage
let sageMiddleware=createSagaMiddleware();
let store=createStore(reducers,applyMiddleware(logger),applyMiddleware(sageMiddleware))
sageMiddleware.run(sagas)
export default store

//redux流程
//ui=>action=>reducer=>store
// 用户在ui视图层触发action,action就是一个描述作用reducer,reducer返回store上  拿到store里面数据后更新视图数据


//中间件
//ui=>action=>(middleware)=>reducer=>store