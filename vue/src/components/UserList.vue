
<script setup>
import axios from 'axios';
import { ref, computed } from 'vue'
import { usePiniaData } from '../stores/counter.js'
import { showSuccessToast, showFailToast } from 'vant'
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
//计算当前页数据
const searchDate = (list, search) => {
    const res = list.find(item => new String(item.id).indexOf(search) >= 0 || item.username.indexOf(search) >= 0)
    return res ? [res] : []
}
const dataShow = computed(() => searchValue.value ? searchDate(items.value, searchValue.value) : items.value.slice(currentPage.value * 20 - 20, currentPage.value * 20))

//初始化axios请求配置
const token = window.localStorage.getItem('token')
//设置 common 通用默认请求头，之后的每一个请求都默认附带这个参数
axios.defaults.headers.common['Authorization'] = token
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

token ? getUserList() : changeRoute('login')

//初始化弹出层状态
const popup = ref(false);
//初始化弹出层内容
const popupData = ref([])
const showPopup = (item) => {
    popup.value = true;
    popupData.value = item
};


</script>
<template>
    <div>

        <van-search class="userListSearch" show-action @search="onSearch" @cancel="" v-model="searchValue"
            placeholder="查找用户" />
        <van-list class="userList">
            <!--未做懒加载（未打算）-->
            <van-cell v-for="item in dataShow" :key="item.id" :title="`ID:${item.id} ${item.username}`" is-link value="编辑"
                @click="showPopup(item)" />
        </van-list>
        <van-pagination v-model="currentPage" :item-per-page="10" :total-items="pageCount" :show-page-size="3" />
        <!--通过 v-model:show 控制 弹出层 是否展示。-->
        <van-popup v-model:show="popup" :style="{ padding: '5vw' }">
            <p> 用户ID: {{ popupData.id }}</p>
            <p> 用户名：{{ popupData.username }}</p>
            <p v-if="piniaData.datas.userInfo.id === 1"> 密码：{{ popupData.password }}</p>
            <p>邮箱：{{ popupData.email }}</p>
            <p>用户等级：{{ popupData.standing }}</p>
            <p>用户余额：{{ popupData.money }}</p>
            <p>邀请码: {{ popupData.yqm }}</p>
            <p>账号状态：{{ !popupData.status ? '正常' : '封禁' }}</p>
            <div class="submit">
                <van-button size='small' plain type="primary">提交</van-button>
            </div>
        </van-popup>
    </div>
</template>

<style scoped>
.userListSearch {
    height: 10vh;
    position: fixed;
    top: 5vh;
    z-index: 999;
}

.userList {
    margin-top: 15vh;
    height: 75vh;
    overflow: auto;
}

.submit{
    width: 75vw;
    margin-top: 3vh;
    display: flex;
    justify-content: center;
}
</style>