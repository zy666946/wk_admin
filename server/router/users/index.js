import express from "express"
import mysql from 'mysql'
import jwt from 'jsonwebtoken'
import fs from 'node:fs'
import mysqlp from '../../utils/mysql_promise.js'

//引入配置文件
const config = JSON.parse(fs.readFileSync('./config.json'))
//随机邀请码
const generateInviteCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}
//mysql连接实例
const sqldb = mysql.createPool({
    host: config.sqlUrl,
    prot: config.sqlPort,
    user: config.sqlUserName,
    password: config.sqlPassWord,
    database: config.sqlName
})
//express实例
const app = express()
//登录路由
app.post('/login', async (req, res) => {
    try {
        const resdb = await mysqlp('select * from users where username=? and password=?', [req.body.userName, req.body.passWord])
        //如果数据匹配
        if (resdb[0]) {
            //判断账号状态
            if (resdb[0].status) {
                res.send({
                    status: -1,
                    message: '账号被封禁'
                })
            } else {
                res.send({
                    status: 1,
                    //调用jwt.sign加密用户信息
                    token: jwt.sign({ username: req.body.userName }, config.jwtKey, { expiresIn: config.expiresInTime })
                })
            }
        } else {
            res.send({
                status: -1,
                message: '密码错误'
            })
        }
    } catch (error) {
        console.log(error)
        res.send({
            status: -1,
            message: '服务器错误'
        })
    }

})
//注册路由
app.post('/register', async (req, res) => {
    try {
        const resusername = await mysqlp('select * from users where username=?', req.body.userName)
        const resemail = await mysqlp('select * from users where email=?', req.body.email)
        const resboss = await mysqlp('select * from users where yqm=?', req.body.yqm)
        if (resusername[0]) res.send({
            status: -1,
            message: '用户名已被注册'
        })
        else if (resemail[0]) res.send({
            status: -1,
            message: '邮箱已被注册'
        })
        else if (!resboss[0]) res.send({
            status: -1,
            message: '邀请码无效'
        })
        else {
            //无问题开始注册
            const resregister = await mysqlp('insert into users set ?', {
                username: req.body.userName,
                password: req.body.passWord,
                email: req.body.email,
                boss: resboss[0].id,
                standing: resboss[0].yqprice,
                yqm: generateInviteCode(),
                yqprice: 2
            })
            if (resregister.affectedRows === 1) res.send({
                status: 1,
                message: '注册成功',
                token: jwt.sign({ username: req.body.userName }, config.jwtKey, { expiresIn: config.expiresInTime }),
            })
            else {
                throw ('数据库写入异常！', resregister)
            }
        }
    } catch (error) {
        console.log(error)
        res.send({
            status: -1,
            message: '服务器错误'
        })
    }
})
//个人信息获取
app.post('/getInfo', async (req, res) => {
    try {
        const resInfo = await mysqlp('select id,username,email,money,status,standing,boss,yqprice,yqm from users where username=?', req.user.username)
        //判断账号状态
        if (resInfo[0].status) res.send({
            status: -1,
            message: '账号已被封禁'
        })
        else res.send({
            status: 1,
            data: resInfo[0]
        })
    } catch (error) {
        console.log(error)
        res.send({
            status: -1,
            message: '服务器错误'
        })
    }

})
//获取下级列表
app.post('/getUserList', async (req, res) => {
    try {
        const resInfo = await mysqlp('select * from users where username=?', req.user.username)
        if (resInfo[0].id === 1) {
            const resUserList = await mysqlp('select * from users')
            res.send({
                status: 1,
                data: resUserList
            })
        }
        else if (resInfo[0].status) res.send({
            status: -1,
            message: '账号已被封禁'
        })
        else {
            const resUserList = await mysqlp('select id,username,email,money,status,standing,yqm from users where boss=?', resInfo[0].id)
            res.send({
                status: 1,
                data: resUserList
            })
        }
    } catch (error) {
        console.log(error)
        res.send({
            status: -1,
            message: '服务器错误'
        })
    }
})
//修改用户信息
app.post('/changeUserInfo', async (req, res) => {
    try {
        //获取修改者信息
        const resInfo = await mysqlp('select * from users where username=?', req.user.username)
        //获取被修改者信息
        const resChangeInfo = await mysqlp('select * from users where id=?', req.body.id)
        //查询邀请码是否已存在（查询除修改对象外）
        const resYqm = await mysqlp('select * from users where id!=? and yqm=?', [req.body.id, req.body.yqm])
        //判断费率
        if (+req.body.standing < +resInfo[0].standing) res.send({
            status: -1,
            message: '费率不能低于自己'
        })
        //判断邀请码是否已被使用
        else if (resYqm[0]) res.send({
            status: -1,
            message: '邀请码已被使用'
        })
        else if (req.body.yqm.length > 8 || req.body.yqm.length < 4) res.send({
            status: -1,
            message: '邀请码应长度在4-8之间'
        })
        //超级管理员修改
        else if (resInfo[0].id === 1) {
            const resChange = await mysqlp('update users set ? where id=?', [{
                password: req.body.password,
                email: req.body.email,
                standing: req.body.standing,
                //费率修改后他的余额就应该同比变化
                money: Math.ceil(resChangeInfo[0].money * (req.body.standing / resChangeInfo[0].standing)),
                yqm: req.body.yqm
            },
            req.body.id])
            if (resChange.affectedRows === 1) res.send({
                status: 1,
                message: '修改成功'
            })
            else {
                throw ('数据库修改异常', resChange)
            }
        }
        //判断是否下级
        else if (resInfo[0].id === +resChangeInfo[0].boss) {
            const resChange = await mysqlp('update users set ? where id=?', [{
                standing: req.body.standing,
                //费率修改后他的余额就应该同比变化
                money: Math.ceil(resChangeInfo[0].money * (req.body.standing / resChangeInfo[0].standing)),
                yqm: req.body.yqm
            },
            req.body.id])
            if (resChange.affectedRows === 1) res.send({
                status: 1,
                message: '修改成功'
            })
            else {
                throw ('数据库修改异常', resChange)
            }
        }
        else {
            res.send({
                status: -1,
                message: '修改对象不是你的代理'
            })
        }
    } catch (error) {
        console.log(error)
        res.send({
            status: -1,
            message: '服务器错误'
        })
    }

})
//修改邮箱
app.post('/changeEmail', async (req, res) => {
    try {
        const resInfo = await mysqlp('select * from users where username=?', req.user.username)
        const resEmail = await mysqlp('select * from users where email=?', req.body.email)
        if (resInfo[0].status) res.send({
            status: -1,
            message: '账号已被封禁'
        })
        else if (resEmail[0]) res.send({
            status: -1,
            message: '邮箱已被使用'
        })
        else {
            const resChangeEmail = await mysqlp('update users set email=? where id=?', [req.body.email, resInfo[0].id])
            if (resChangeEmail.affectedRows === 1) res.send({
                status: 1,
                message: '修改成功'
            })
            else res.send({
                status: -1,
                message: '数据库读写异常'
            })
        }
    } catch (error) {
        console.log(error)
        res.send({
            status: -1,
            message: '服务器错误'
        })
    }
})

export default app