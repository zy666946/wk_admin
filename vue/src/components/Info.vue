<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-09-07 02:11:23
 * @LastEditors: zy 319085634@qq.com
 * @LastEditTime: 2023-09-12 10:58:13
 * @FilePath: \node\admin\vue\src\components\Info.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { useRouter } from 'vue-router'
import { usePiniaData } from '../stores/counter';
import { showSuccessToast, showFailToast } from 'vant'
const piniaData = usePiniaData()


const changeEmail = () => {

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
            <van-cell title="余额" :value="piniaData.datas.userInfo.money" />
            <van-cell @click="changeEmail" title="邮箱" :value="piniaData.datas.userInfo.email" label="点击修改" />
            <van-cell title="上级ID" :value="piniaData.datas.userInfo.boss" />
            <van-cell title="我的邀请码" :value="piniaData.datas.userInfo.yqm" />
            <van-cell title="下级默认等级" :value="piniaData.datas.userInfo.yqprice" />
        </van-cell-group>
        <van-button class="loginBack" type="danger" @click="loginBack()">退出登录</van-button>

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