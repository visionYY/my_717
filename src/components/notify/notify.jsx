import React,{Component} from "react"
import ReactDOM from "react-dom"
export class Notify extends Component{
    constructor(){
        super()
        this.state={
            isOpen:true
        }
        this.notifyStyle={
            position:"absolute"
        }
        this.contentStyle={
            position:"absolute",
            left:"50%",
            top:"50%",
            transform:"translate3d(-50%,-50%,0)",
            padding:"10px",
            width:"80%",
            color:"#fff",
            background:"rgba(0,0,0,0.7)"
        }
        this.openNotify=this.openNotify.bind(this)
    }
    render(){
        let {isOpen}=this.state
        let {msg}=this.props
        return isOpen?(
            <div id="notify" style={this.contentStyle}>
                <div>{msg}</div>
            </div>
        ):null
    }
    openNotify(){//是否渲染
        this.setState({
            isOpen:true
        })
    }
    componentWillUnmount(){
        console.log("即将删除notify组件")
    }
}

export class Loading extends Component{
    constructor(){
        super()
        this.state={
            isOpen:true
        }
        this.notifyStyle={
            position:"absolute",
            left:"0",
            top:"0",
            width:"100%",
            height:"100%",
            background:"rgba(0,0,0,0.7)"
            
        }
        this.contentStyle={
            position:"absolute",
            left:"50%",
            top:"50%",
            transform:"translate3d(-50%,-50%,0)",
            textAlign:"center"
        }
    }
    render(){
        let {isOpen}=this.state
        let {msg}=this.props
        return isOpen?(
            <div id="notify" style={this.notifyStyle}>
                <div style={this.contentStyle}>
                    <svg width="57" height="57" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                        <g fill="none">
                            <g transform="translate(1 1)">
                                <circle cx="5" cy="50" r="5">
                                    <animate attributeName="cy"
                                        begin="0s" dur="2.2s"
                                        values="50;5;50;50"
                                        calcMode="linear"
                                        repeatCount="indefinite" />
                                    <animate attributeName="cx"
                                        begin="0s" dur="2.2s"
                                        values="5;27;49;5"
                                        calcMode="linear"
                                        repeatCount="indefinite" />
                                </circle>
                                <circle cx="27" cy="5" r="5">
                                    <animate attributeName="cy"
                                        begin="0s" dur="2.2s"
                                        from="5" to="5"
                                        values="5;50;50;5"
                                        calcMode="linear"
                                        repeatCount="indefinite" />
                                    <animate attributeName="cx"
                                        begin="0s" dur="2.2s"
                                        from="27" to="27"
                                        values="27;49;5;27"
                                        calcMode="linear"
                                        repeatCount="indefinite" />
                                </circle>
                                <circle cx="49" cy="50" r="5">
                                    <animate attributeName="cy"
                                        begin="0s" dur="2.2s"
                                        values="50;50;5;50"
                                        calcMode="linear"
                                        repeatCount="indefinite" />
                                    <animate attributeName="cx"
                                        from="49" to="49"
                                        begin="0s" dur="2.2s"
                                        values="49;5;27;49"
                                        calcMode="linear"
                                        repeatCount="indefinite" />
                                </circle>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        ):null
    }
    componentWillUnmount(){
        console.log("即将删除notify组件")
    }
}

class NotifyPortals extends Component{
    constructor(){
        super()
        this.state={
            isMounted:false,
            renderTo:document.body,
            msg:"some message for you..."
        }
        document.body.style.cssText="position:relative";
        this.mountNotify=this.mountNotify.bind(this)
    }
    render(){
        let {isMounted,renderTo,msg}=this.state;
        let {type}=this.props;
        return isMounted&&ReactDOM.createPortal(type=="loading"?<Loading/>:<Notify msg={msg}/>,renderTo)
       
    }
   
    componentDidMount(){
        let {container}=this.props
        if(typeof container=="string"){
            let el=document.querySelector(container)
            el.style.cssText="position:relative";
            this.setState({ 
                renderTo:el
            })
        }else{
            console.log("container目前只支持字符串")
        }
    }
    mountNotify(msg){
        this.setState({
            isMounted:true,
            msg
        })
        if(!this.props.type!=="loading"){
            setTimeout(() => {
                this.setState({
                    isMounted:false
                })
            }, 2000);
        }
       
    }
    unMountNotify(){
        this.setState({
            isMounted:false
        })
    }
   
}
export default NotifyPortals