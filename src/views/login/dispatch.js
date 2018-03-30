import {USER_INFO} from "../../store/reducers"
export default function mapDispatchToProps(dispatch){//接受到dispatch函数
    return {
        saveUser(data){
            dispatch({
                type:USER_INFO,
                data
            })
        }
    }
}