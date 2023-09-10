import express from "express"
import mysql from 'mysql'
import jwt from 'jsonwebtoken'
import fs from 'node:fs'

//引入配置文件
const config = JSON.parse(fs.readFileSync('./config.json'))

//mysql连接实例
const sqldb = mysql.createPool({
    host: config.sqlUrl,
    prot: config.sqlPort,
    user: config.sqlUserName,
    password: config.sqlPassWord,
    database: config.sqlName
})
const app = express()



//登录路由
app.post('/login', (req, res) => {
    sqldb.query('select * from users where username=? and password=?', [req.body.userName, req.body.passWord], (error, results) => {
        if (error) {
            console.log(error.message)
            res.send(
                {
                    status: -1,
                    message: '服务器错误'
                }
            )
        }
        else if (results[0]) {
            if (results[0].status) {
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

        }
        else {
            res.send({
                status: -1,
                message: '密码错误'
            })
        }
    })
})
//注册路由
app.post('/register', (req, res) => {
    sqldb.query('select * from users where username=?', req.body.userName, (error, results) => {
        if (results[0]) {
            res.send({
                status: -1,
                message: '用户名已被注册'
            })
            return
        }
        else if (error) {
            res.send({
                status: -1,
                message: '服务器错误'
            })
            return
        } else {
            sqldb.query('select * from users where email=?', req.body.email, (error, results) => {
                if (results[0]) {
                    res.send({
                        status: -1,
                        message: '该邮箱已被注册'
                    })
                    return
                }
                else if (error) {
                    res.send({
                        status: -1,
                        message: '服务器错误'
                    })
                    return
                }
                //无问题开始注册 
                else {
                    //邀请码验证
                    sqldb.query('select * from users where yqm=?', req.body.yqm, (error, results) => {
                        if (!results[0] || results[0].status) {
                            res.send({
                                status: -1,
                                message: '邀请码无效'
                            })
                        }
                        else if (error) {
                            res.send({
                                status: -1,
                                message: '服务器错误'
                            })
                            return
                        } else {

                            //无问题开始注册
                            //随机邀请码
                            const generateInviteCode = () => {
                                const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                                let code = '';
                                for (let i = 0; i < 8; i++) {
                                    code += chars[Math.floor(Math.random() * chars.length)];
                                }
                                return code;
                            }

                            sqldb.query('insert into users set ?', {
                                username: req.body.userName,
                                password: req.body.passWord,
                                email: req.body.email,
                                boss: results[0].id,
                                standing: results[0].yqprice,
                                yqm: generateInviteCode(),
                                yqprice: 2
                            }, (error, results) => {
                                if (error) {
                                    console.log('添加数据失败：' + error.message)
                                    res.send({
                                        status: -1,
                                        message: '服务器错误'
                                    })
                                }
                                else if (results.affectedRows === 1) {
                                    console.log('添加数据成功')
                                    res.send({
                                        status: 1,
                                        token: jwt.sign({ username: req.body.userName }, config.jwtKey, { expiresIn: config.expiresInTime }),
                                        message: '注册成功'
                                    })
                                }
                                else {
                                    console.log('数据库未知错误，影响了' + results.affectedRows + '条数据')
                                    res.send({
                                        status: -1,
                                        message: '服务器错误'
                                    })
                                }
                            })
                        }
                    })


                }
            })
        }
    })

})
//个人信息获取
app.post('/getInfo', (req, res) => {
    if (req.user) {
        sqldb.query('select id,username,email,money,status,standing,boss,yqprice,yqm from users where username=?', req.user.username, (error, results) => {
            if (error) {
                console.log(error.message)
                res.send(
                    {
                        status: -1,
                        message: '服务器错误'
                    }
                )
            }
            else if (results[0]) {
                if (results[0].status) {
                    res.send({
                        status: -1,
                        message: '账号被封禁'
                    })
                } else {
                    res.send({
                        status: 1,
                        data: results[0]
                    })
                }

            }
            else {
                res.send({
                    status: -1,
                    message: '密码错误'
                })
            }
        })
    }
})
//获取下级列表
app.post('/getUserList', (req, res) => {
    if (req.user) {
        sqldb.query('select * from users where username=?', req.user.username, (error, results) => {
            if (error) {
                res.send({
                    status: -1,
                    message: '服务器错误'
                })
            } else {
                if (results[0].id === 1) {
                    sqldb.query('select * from users', (error, results) => {
                        res.send({
                            status: 1,
                            data: results
                        })
                    })
                }
                else if (!results[0].status) {
                    sqldb.query('select id,username,email,money,status,standing,yqm from users where boss=?', results[0].id, (error, results) => {
                        res.send({
                            status: 1,
                            data: results
                        })
                    })

                } else {
                    res.send({
                        status: -1,
                        message: '账号异常'
                    })
                }
            }
        })

    } else {
        res.send({
            status: -1,
            message: 'token错误'
        })
    }
})
//修改用户信息
app.post('/changeUserInfo', (req, res) => {
    if (req.user) {
        //查验调用者身份
        sqldb.query('select * from users where username=?', req.user.username, (error, results) => {
            if (error) {
                res.send({
                    status: -1,
                    message: '服务器错误'
                })
            }
            //
            else {
                if (!results[0].status) {
                    //判断修改对象是不是你的代理
                    //查询操作对象的boss
                    sqldb.query('select * from users where id=?', req.body.id, (error, results2) => {
                        if (error) {
                            res.send({
                                status: -1,
                                message: '服务器错误'
                            })
                        }
                        else if (+results2[0].boss === +results[0].id) {
                            //如果修改等级低于自身
                            if (+req.body.standing < results[0].standing) {
                                res.send({
                                    status: -1,
                                    message: '下级费率不能低于自己'
                                })
                            }
                            else {
                                //判断邀请码是否可用
                                sqldb.query('select * from users where id!=? and yqm=?', [req.body.id, req.body.yqm], (error, results3) => {
                                    if (error) {
                                        res.send({
                                            status: -1,
                                            message: '服务器错误'
                                        })
                                    }
                                    else if (results3[0]) {
                                        res.send({
                                            status: -1,
                                            message: '邀请码已被使用'
                                        })
                                    }
                                    //开始修改
                                    else {

                                        sqldb.query('update users set ? where id=?', [{
                                            email: req.body.email,
                                            standing: req.body.standing,
                                            //费率修改后他的余额就应该同比缩减
                                            money: Math.ceil(results2[0].money * (req.body.standing / results2[0].standing)),
                                            yqm: req.body.yqm
                                        }, req.body.id], (error, results2) => {
                                            if (error) {
                                                console.log(error.message)
                                                res.send({
                                                    status: -1,
                                                    message: '服务器错误'
                                                })
                                            } else {
                                                res.send({
                                                    status: 1,
                                                    message: '修改成功'
                                                })
                                            }
                                        })
                                    }
                                })


                            }
                        }
                        else {
                            res.send({
                                status: -1,
                                message: '操作异常'
                            })
                        }
                    })

                } else {
                    res.send({
                        status: -1,
                        message: '账号异常'
                    })
                }
            }
        })
    }
    //如果没有user参数的话（一般不会走到这一步，jwt会抛错）
    else {
        res.send({
            status: -1,
            message: 'token错误'
        })
    }
})



export default app