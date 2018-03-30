//第三方node包用于加密
const jwt=require("jsonwebtoken")
const fs = require("fs")
const http=require("http")
const querystring=require("querystring")
const Mock=require("mockjs")
const _=require("lodash")//删除数组中一项的第三方插件
//封装请求网站数据
function queryApi(url,methods,params){
    return new Promise((resolve,reject)=>{
        //请求远端商品列表数据
        const options = {
            hostname: 'www.lb717.com',//域名
            port: 80,
            path: url,
            method: methods,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        //商品列表的接口
        let data = "";
        let request = http.request(options, (response) => {//获取远端数据
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                data += chunk
            });
            response.on('end', () => {//返回前端商品列表数据
                resolve(JSON.stringify(data))
            });
        })
        if (methods.toLowerCase() == "post") {
            request.write(querystring.stringify(params))//传的参数
        }
        request.end()
    })
}
module.exports=function(app){
    //请求远端商品列表数据
    // const options = {
    //     hostname: 'www.lb717.com',
    //     port: 80,
    //     path: '/mall/index/getGoodsChannel',//域名
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //     }
    // };

    //商品列表的接口
    app.post("/mall/index/getGoodsChannel", function (req, res) {
        // let data = "";
        // let request = http.request(options, (response) => {//获取远端数据
        //     response.setEncoding('utf8');
        //     response.on('data', (chunk) => {
        //         console.log(`响应主体: ${chunk}`);
        //         data += chunk
        //     });
        //     response.on('end', () => {//返回前端商品列表数据
        //         res.end(JSON.stringify(data))
        //     });
        // })
        // request.write(querystring.stringify(req.body))//传的参数
        // request.end()
        queryApi("/mall/index/getGoodsChannel","post",req.body)
        .then((data)=>{
            res.end(data)
        })
    })
    //register注册接口
    app.post("/user/register", function (req, res) {
        console.log(req.body)
        let user = fs.readFileSync("server/user.json", { encoding: "utf-8" })//读取数据库数据
        console.log(user)
        user = JSON.parse(user)
        user.push(req.body)
        fs.writeFile('server/user.json', JSON.stringify(user), function () {
            res.end(JSON.stringify({
                "success": 1,
                "info": "register success"
            }))
        })//获取数据写入数据库中
    })

    //login登录接口
    app.post("/user/login", function (req, res) {
        let user = fs.readFileSync("server/user.json", { encoding: "utf-8" })//读取数据库数据
        user = JSON.parse(user)//转成Json对象
        let login = req.body;
        let resInfo = {//默认信息
            success: 0,
            info: "用户名或密码错误",
            token: ''//返回密钥
        }
        user.forEach(usr => {
            if (usr.username == login.username && usr.password == login.password) {
                resInfo.success = 1;
                resInfo.info = "login success";//登录成功返回信息
                resInfo.user={//我的页面记录用户名时间昵称
                    name:usr.username,
                    time:new Date().toLocaleDateString(),
                    nickName:"mAyaN"
                }
            }
        });
        if (resInfo.success == 1) {
            resInfo.token = jwt.sign(login, "1511", {
                expiresIn: 60*60//设置tooken的超时
            })//进行加密设置token
        }
        res.end(JSON.stringify(resInfo))
    })

    //添加购物车接口
    app.post("/user/Cart/addCart", function (req, res) {
        //console.log(req.body)
        jwt.verify(req.body.token, "1511", (err, decoded) => {
            if (err) {
                res.end(JSON.stringify({
                    info: "登录过期,请重新登录",
                    detail: err.TokenExpiredError
                }))
            } else {//解析成功返回到cart_info.json中
                //console.log(decoded.username)//登录名
                let cartInfo = JSON.parse(fs.readFileSync("./server/cart_info.json",{ encoding: "utf-8" }))
                if (cartInfo[decoded.username]) {
                    let recordList=cartInfo[decoded.username];
                    let flag=false//新加商品
                    recordList.forEach((item,index)=>{//购物车商品进行排重
                        if(item.goods_id==req.body.goods_info.goods_id){
                            ++item.count;
                            flag=true//重复商品
                        }
                    })
                    if(!flag){
                        let record=req.body.goods_info;
                        record.count=1;
                        record.select=0;
                        cartInfo[decoded.username].push(record)
                    }
                    
                } else {
                    let record=req.body.goods_info;
                    record.count=1;
                    record.select=0;
                    cartInfo[decoded.username] = [record]
                }
                //console.log(cartInfo)
                fs.writeFile(__dirname + "/cart_info.json", JSON.stringify(cartInfo), function () {
                    res.end("1")
                })

            }
        })//解密
    })
    //分类接口
    app.get('/mobile/Category/categorySon',function (req, res){
        let data = JSON.parse(fs.readFileSync("./list.json", {encoding:"utf-8"}))
        console.log(data)
        data.list.map((item,ind) =>{
        if(item.id==req.query.id){
            res.end(JSON.stringify(item))
        }
        })
    })
    //登录过后获取购物车的商品列表接口
    app.post("/user/Cart/goodsList",function(req,res){
        console.log(req.body)
        jwt.verify(req.body.token, "1511", (err,decoded)=>{
            if (err) {
                res.end(JSON.stringify({
                    info: "登录过期,请重新登录",
                    detail: err.TokenExpiredError,
                    error:1
                }))
            }else{ //初始化购物车
                console.log(decoded.username)
                // if(err){
                //     res.json(error)
                // }else{
                //     let goodsRecord=JSON.parse(fs.readFileSync("./server/cart_info.json",{ encoding: "utf-8" }))
                //     res.json(goodsRecord[decoded.username])
                // }
                try{
                    let goodsRecord=JSON.parse(fs.readFileSync("./server/cart_info.json",{ encoding: "utf-8" }))
                    let goodsList=goodsRecord[decoded.username] || []
                    res.json(goodsList)
                }
                catch(error){
                    res.json(error)
                }
            }
        })
    })
    //删除购物车指定商品
    app.post("/user/Cart/delGoods",function(req,res){//根据后端返回的数据删除指定购物车商品
        let cartRecord=JSON.parse(fs.readFileSync("./server/cart_info.json",{ encoding: "utf-8" }))//根据ID的得到数据
        jwt.verify(req.body.token,"1511",function(err,decoded){
            if(err){
                res.json(err)
            }else{
                let cartList=cartRecord[decoded.username]
                let deGoods=_.remove(cartList,function(item){
                    return req.body.selectID.indexOf(item.goods_id)>-1
                })
                console.log(cartList)
                cartRecord[decoded.username]=cartList
                fs.writeFile(__dirname + "/cart_info.json", JSON.stringify(cartRecord), function () {
                    res.json({
                        success:1,
                        info:"删除成功",
                        delGoods:deGoods,//删除的商品有哪些
                        leftGoods:cartList//删除后剩下的数据
                    })
                })
            }
        })  
        
    })

    //新加邮寄地址
    app.post("/user/Mail/addNew",function(req,res){
        console.log(req.body)
        jwt.verify(req.body.token,"1511",function(err,decoded){
            if(err){
                res.json(err)
            }else{
                let usr=decoded.username;
                let delivery=JSON.parse(fs.readFileSync("./server/delivery.json",{encoding:"utf-8"}))
                delete req.body.token;
                if(delivery[usr]){
                    delivery[usr].push(req.body)
                }else{
                    delivery[usr]=[req.body]
                }
                fs.writeFile("./server/delivery.json",JSON.stringify(delivery),function(err){
                    if(err){
                        res.json(err)
                    }else{
                        res.json({
                            success:"1",
                            info:"地址添加成功"
                        })
                    }
                })    
            }
        })
    })

    //获取邮寄地址列表接口
    app.post("/user/Mail/list",function(req,res){
        jwt.verify(req.body.token,"1511",function(err,decoded){
            if(err){
                res.json(err)
            }else{
                let list=JSON.parse(fs.readFileSync("./server/delivery.json",{encoding:"utf-8"}))
                setTimeout(()=>{
                    res.json(list[decoded.username])
                },1500)
            }
        })
        
    })

      //删除邮寄地址列表接口
      app.post("/user/Mail/deletelist",function(req,res){
        jwt.verify(req.body.token,"1511",function(err,decoded){
            if(err){
                res.json(err)
            }else{
                let list=JSON.parse(fs.readFileSync("./server/delivery.json",{encoding:"utf-8"}))[decoded.username]
                list.splice(req.body.index,1)
                setTimeout(()=>{
                    res.json(list)
                },1500)
            }
        })
        
    })

    //编辑邮寄地址列表接口
    app.post("/user/Mail/editlist",function(req,res){
        jwt.verify(req.body.token,"1511",function(err,decoded){
            if(err){
                res.json(err)
            }else{
                let list=JSON.parse(fs.readFileSync("./server/delivery.json",{encoding:"utf-8"}))[decoded.username]
                setTimeout(()=>{
                    res.json(list[req.body.index])
                },1500)
            }
        })
        
    })
}