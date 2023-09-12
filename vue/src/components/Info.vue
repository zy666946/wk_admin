<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-09-07 02:11:23
 * @LastEditors: zy 319085634@qq.com
 * @LastEditTime: 2023-09-13 01:41:58
 * @FilePath: \node\admin\vue\src\components\Info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import config from '../../config.json'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { usePiniaData } from '../stores/counter';
import { showSuccessToast, showFailToast, showLoadingToast } from 'vant'
import { ref, computed } from 'vue'
const piniaData = usePiniaData()
//初始化axios请求配置
const token = window.localStorage.getItem('token')
//设置 common 通用默认请求头，之后的每一个请求都默认附带这个参数
axios.defaults.headers.common['Authorization'] = token


//修改邮箱弹出层状态
const popupEmail = ref(false)
//修改邮箱弹出界面
const popupChangeEmail = () => {
    popupEmail.value = popupEmail.value ? false : true
}
//初始化新邮箱内容
const newEmail = ref('')

//邮箱修改提交事件
const changeEmail = async () => {
    if (!newEmail.value) return showFailToast('请先输入邮箱')
    showLoadingToast({
        message: '加载中...',
        forbidClick: true,
    })
    try {
        const res = await axios({
            method: 'post',
            url: config.serverUrl + ':' + config.serverPort + '/changeEmail',
            data: {
                email: newEmail.value
            }
        })
        if (res.data.status === 1) {
            //更新pinia状态
            piniaData.updateEmail(newEmail.value)
            //初始化新邮箱内容
            newEmail.value = ''
            //关闭弹窗
            popupChangeEmail()
            //弹出成功消息
            showSuccessToast(res.data.message)
        }
        else {
            //弹出失败消息
            showFailToast(res.data.message)
        }
    } catch (error) {
        console.log(error)
    }

}




//声明路由实例
const router = useRouter()
const changeRoute = (name) => {
    router.push({ name: name })
}
//退出登录
const loginBack = () => {
    window.localStorage.removeItem('token')
    showSuccessToast('已退出')
    setTimeout(() => {
        changeRoute('login')
    }, 1500)
}

</script>
<template>
    <div>
        <van-cell-group inset>
            <van-cell title="用户ID" :value="piniaData.datas.userInfo.id" />
            <van-cell title="用户名" :value="piniaData.datas.userInfo.username" />
            <van-cell title="费率" :value="piniaData.datas.userInfo.standing" />
            <van-cell title="余额" :value="piniaData.datas.userInfo.money">
            </van-cell>
            <van-cell @click="popupChangeEmail" title="邮箱" :value="piniaData.datas.userInfo.email" is-link />
            <van-cell title="上级ID" :value="piniaData.datas.userInfo.boss" />
            <van-cell title="我的邀请码" :value="piniaData.datas.userInfo.yqm" />
            <van-cell title="下级默认等级" :value="piniaData.datas.userInfo.yqprice" />
        </van-cell-group>
        <van-button class="loginBack" type="danger" @click="loginBack()">退出登录</van-button>
        <van-popup style="width: 80vmin;" v-model:show="popupEmail" :style="{ padding: '5vmin' }">
            <p class="popupH1">邮箱修改</p>
            <van-field v-model="newEmail" placeholder="请输入新的邮箱">
                <template #button>
                    <van-button @click="changeEmail" size="small" type="primary">提交</van-button>
                </template>
            </van-field>

        </van-popup>

    </div>
</template>
<style scoped>
.loginBack {
    display: flex;
    justify-content: center;
    width: 30vw;
    margin: 5vh auto;
}
</style>