//搜索页
import React,{Component} from "react"
import "./search.less"
import {connect} from "react-redux"
class Search extends Component{
    constructor(){
        super()
        this.toSearch=this.toSearch.bind(this)
        this.clearHistory=this.clearHistory.bind(this)
        this.testSaga=this.testSaga.bind(this)
        this.state={
            historylist:[]
        }
    }
    render(){
        let {historylist}=this.state
        let {goodsList}=this.props
        console.log(goodsList)
        return (
            <div id="search">
                <header><input type="text" ref="keyWords"/><button onClick={this.toSearch}>搜索</button></header>
                <section className="recent-search">
                    <p>最近搜索<span onClick={this.clearHistory} className="iconfont icon-home"></span></p>
                    {
                        historylist.length==0?<p>暂无搜索记录...</p>:
                        <ul className="ks-clear"> 
                            {
                                this.state.historylist.map((item,index)=>{
                                    return <li onClick={()=>{this.toResult(item)}} key={index}>{item}</li>
                                })
                            }
                        </ul>
                    }
                </section>
                <section className="common-search">
                    <ol className="ks-clear">
                        <li onClick={this.testSaga}>测试Sage中间件</li>
                        <li>魏晨</li>
                    </ol>
                    <p>通过sage请求数据，将异步转同步，并且渲染结果:{goodsList.data&&goodsList.data.data[0].goods_name}</p>
                </section>
            </div>
        )
    }
    testSaga(){
        this.props.dispatch({
            type:"GET_GOODS_LIST"
        })
    }
    clearHistory(){//清空history
        localStorage.removeItem("searchHistory")
        this.setState({
            historylist:[]//数组清空
        })
    }
    toSearch(){
        if(!this.refs.keyWords.value) return;//关键词不存在直接返回
        let keyWords=this.refs.keyWords.value;
        let ls=localStorage;
        if(ls.getItem("searchHistory")){
            let shArr=JSON.parse(ls.getItem("searchHistory"));
            if(shArr.indexOf(keyWords)>-1)return;//如果localStorage中存在关键词则直接返回
            shArr.push(keyWords)//不存在把关键词push到localStorage中
            ls.setItem("searchHistory",JSON.stringify(shArr))
        }else{ 
            ls.setItem("searchHistory",JSON.stringify([keyWords]))//keyWords关键词//localStorage存储数据第一个函数名或属性名第二个是值必须是字符串
        }
        
        this.props.history.push("./index/result",{
            key_words:keyWords//搜索关键词
        })
    }
    toResult(keyWords){
        this.props.history.push("./index/result",{
            key_words:keyWords//搜索关键词
        })
    }
    componentDidMount(){
        if(localStorage.getItem("searchHistory")){
            this.setState({
                historylist:JSON.parse(localStorage.getItem("searchHistory"))
            })
        }
    }
}
export default connect(function(state){
    return {
        goodsList:state.goods_list
    }
},null,null,{pure:false})(Search)