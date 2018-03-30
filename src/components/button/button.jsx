import React,{Component} from "react"
import "./button.less"
class Button extends Component{
    render(){
        return (
            <button onClick={this.props.onClick} className="common-button">{this.props.children}</button>
        )
    }
}
export default Button