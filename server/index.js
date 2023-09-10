/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-09-05 17:01:30
 * @LastEditors: zy 319085634@qq.com
 * @LastEditTime: 2023-09-11 02:00:09
 * @FilePath: \node\admin\server\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * _______________#########_______________________ 
 * ______________############_____________________ 
 * ______________#############____________________ 
 * _____________##__###########___________________ 
 * ____________###__######_#####__________________ 
 * ____________###_#######___####_________________ 
 * ___________###__##########_####________________ 
 * __________####__###########_####_______________ 
 * ________#####___###########__#####_____________ 
 * _______######___###_########___#####___________ 
 * _______#####___###___########___######_________ 
 * ______######___###__###########___######_______ 
 * _____######___####_##############__######______ 
 * ____#######__#####################_#######_____ 
 * ____#######__##############################____ 
 * ___#######__######_#################_#######___ 
 * ___#######__######_######_#########___######___ 
 * ___#######____##__######___######_____######___ 
 * ___#######________######____#####_____#####____ 
 * ____######________#####_____#####_____####_____ 
 * _____#####________####______#####_____###______ 
 * ______#####______;###________###______#________ 
 * ________##_______####________####______________ 
 */



import express from 'express'
import cors from 'cors'
import expressJWT from 'express-jwt'
import usersRouter from './router/users/index.js'
import fs  from 'node:fs'
//引入配置文件
const config = JSON.parse(fs.readFileSync('./config.json'))



const app = express()
//解析json请求体
app.use(express.json())
//跨域模块
app.use(cors())
//token解析配置
app.use(expressJWT({
	secret: config.jwtKey
}).unless({
	//设置注册路由和登录路由不解析token
	//解析好的token会存入req.user变量
	path: ['/login','/register']
}))

app.use(usersRouter)
//错误处理
app.use((error, req, res, next) => {

    //error.name可以获取到token解析错误时返回的报错类型
    if (error.name === 'UnauthorizedError') {
        res.send({
            status: -1,
            message: '登录失效'
        })
    } else {
        //console.log(error.message)
        res.send({
            status: -1,
            messgae: '服务器错误'
        })
    }
})

app.listen(7777,()=>{
	console.log('server is running in 7777')
})

