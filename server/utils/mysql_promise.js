/*
 * @Author: zy 319085634@qq.com
 * @Date: 2023-09-11 16:58:19
 * @LastEditors: zy 319085634@qq.com
 * @LastEditTime: 2023-09-11 17:57:57
 * @FilePath: \node\admin\server\utils\mysql_promise.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import fs from 'node:fs'
import mysql from 'mysql'
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
//将sql查询结果返回为一个promise对象
const mysqlp = (sql,data)=>{
    return new Promise((resolve, reject) => {
        sqldb.query(sql,data,(error,res)=>{
            if(error){
                reject(error)
            }
            resolve(res)
        })
    })
}

export default mysqlp