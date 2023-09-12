
<script setup>
import axios from 'axios';
import { ref, computed } from 'vue'
import { usePiniaData } from '../stores/counter.js'
import { showLoadingToast, showSuccessToast, showFailToast, showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router';
import config from '../../config.json'
//声明路由实例
const router = useRouter()
const changeRoute = (name) => {
    router.push({ name: name })
}
const piniaData = usePiniaData()
//搜索内容
const searchValue = ref('')
//搜索回车键监听
const onSearch = (value) => {
    console.log(value)
}

//分页
//初始化数据
const items = ref([])
//计算总页数
const pageCount = computed(() => Math.ceil(items.value.length / 20))
//初始化选中的分页
const currentPage = ref(1)
//计算搜索数据
const searchDate = (list, search) => {
    const res = list.find(item => new String(item.id).indexOf(search) != -1 || new String(item.username).indexOf(search) != -1 || new String(item.email).indexOf(search) != -1)
    return res ? [res] : []
}
//计算当前页数据
const dataShow = computed(() => searchValue.value ? searchDate(items.value, searchValue.value) : items.value.slice(currentPage.value * 20 - 20, currentPage.value * 20))

//初始化axios请求配置
const token = window.localStorage.getItem('token')
//设置 common 通用默认请求头，之后的每一个请求都默认附带这个参数
axios.defaults.headers.common['Authorization'] = token
//获取用户列表
const getUserList = async () => {
    try {
        const res = await axios({
            method: 'post',
            url: config.serverUrl + ':' + config.serverPort + '/getUserList',
        })
        if (res.data.status === 1) {
            items.value = res.data.data
            //console.log(items.value)
        } else {
            showFailToast(res.data.message)
            changeRoute('login')
        }

    } catch (error) {
        console.log(error.message)
    }
}
//初始化
token ? getUserList() : changeRoute('login')

//初始化弹出层状态
const popup = ref(false);
//初始化弹出层内容
const popupData = ref([])
//计算账号状态
const userStatus = computed(() => !popupData.status ? '正常' : '封禁')
//弹出层
const showPopup = (item) => {
    popup.value = true;
    //深拷贝一下，防止没提交时页面缓存数据也被修改
    popupData.value = JSON.parse(JSON.stringify(item))
};
//修改用户信息
const changeUserInfo = async (id, username, password, email, standing, yqm) => {
    showLoadingToast({
        message: '加载中...',
        forbidClick: true,
    })

    try {
        const res = await axios({
            method: 'post',
            url: config.serverUrl + ':' + config.serverPort + '/changeUserInfo',
            data: {
                id, username, password, email, standing, yqm
            }
        })
        if (res.data.status === 1) {
            getUserList()
            showSuccessToast(res.data.message)
            popup.value = false
        }
        else showFailToast('出错了')
    } catch (error) {
        console.log(error.message)
        showFailToast('出错了')
    }
}
//修改账户状态
const changeUserStatus = async (status) => {
    const message = status ? '封禁' : '解封'
    try {
        const res = await showConfirmDialog({
            title: '提示',
            message: `你确定要对此用户进行${message}吗？`,
        })

    } catch (error) {

    }


}
</script>
<template>
    <div>

        <van-search class="userListSearch" show-action @search="onSearch" @cancel="" v-model="searchValue"
            placeholder="查找用户" />

        <van-list class="userList">
            <!--未做懒加载（未打算）-->
            <van-cell v-for="item in dataShow" :key="item.id" :title="`ID:${item.id} ${item.username}`" is-link value="查看"
                @click="showPopup(item)" />
            <van-loading v-show="!dataShow[0]">加载中...</van-loading>

        </van-list>
        <van-pagination class="changePage" v-if="pageCount !== 1" v-model="currentPage" :item-per-page="10" :total-items="pageCount"
            :show-page-size="3" />
        <!--通过 v-model:show 控制 弹出层 是否展示。-->
        <van-popup v-model:show="popup" :style="{ padding: '5vmin', width: '80vmin' }">
            <van-field v-model='popupData.id' readonly label="代理ID: " />
            <van-field v-model='popupData.username' readonly label="用户名: " />
            <van-field v-if="piniaData.datas.userInfo.id === 1" v-model='popupData.password' label="密码: " />
            <van-field v-model='popupData.standing' type='number' label="费率：" placeholder="请输入费率" />
            <van-field v-model='popupData.email' label-align="top" :readonly="!piniaData.datas.userInfo.id === 1"
                type='text' label="邮箱：" placeholder="请输入邮箱" />
            <van-field v-model='popupData.money' readonly label="代理余额：">
                <template #button>
                    <van-button size="small" type="primary">充值</van-button>
                </template>
            </van-field>
            <van-field v-model="userStatus" readonly label="帐号状态：">
                <template #button>
                    <van-button @click="changeUserStatus(1)" v-show="!popupData.status" size="small"
                        type="danger">封禁</van-button>
                    <van-button @click="changeUserStatus(0)" v-show="popupData.status" size="success"
                        type="danger">解封</van-button>
                </template>
            </van-field>
            <div class="submit">
                <van-button size='small' plain type="primary"
                    @click="changeUserInfo(popupData.id, popupData.username, popupData.password, popupData.email, popupData.standing, popupData.yqm)">提交</van-button>
            </div>
        </van-popup>
    </div>
</template>

<style scoped>
.userListSearch {
    width: calc(100vw - 25vmin);
    height: 10vh;
    position: fixed;
    top: 5vh;
    z-index: 999;
}

.userList {
    margin-top: 15vh;
    max-height: 75vh;
    overflow: auto;
    width: calc(100vw - 25vmin);
}

.submit {
    width: 100%;
    margin-top: 3vh;
    display: flex;
    justify-content: center;
}
.changePage {
    height: 10vh;
}
</style>