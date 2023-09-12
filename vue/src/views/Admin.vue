<script setup>
import { useRouter } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant'
import axios from 'axios'
//pinia
import { usePiniaData } from '../stores/counter.js'
import { ref } from 'vue'

import Info from '../components/Info.vue'
import OrderList from '../components/OrderList.vue'
import UserList from '../components/UserList.vue'
import config from '../../config.json'

//声明pinia实例
const piniaData = usePiniaData()

const token = window.localStorage.getItem('token')
//设置 common 通用默认请求头，之后的每一个请求都默认附带这个参数
axios.defaults.headers.common['Authorization'] = token
const getInfo = async () => {
	try {
		const userInfo = await axios({
			method: 'post',
			url: config.serverUrl + ':' + config.serverPort + '/getInfo',
			//因为设置了token默认请求头了，所以这里不需要再次设置了
			/*headers: {
				'Authorization': token
			}, */
			//data:{}
		})
		//判断登陆状态
		if (userInfo.data.status === 1) {
			//将返回的解密用户信息存入pinia全局代理对象
			piniaData.updateInfo(userInfo.data.data)

		} else {
			showFailToast(userInfo.data.message)
			changeRoute('login')
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
//未找到token则直接返回登录路由
token ? getInfo() : changeRoute('login')


//侧边栏动态组件名映射
const sideberComponent = {
	0: 'userlist',
	1: 'info',
	2: 'orderList'
}

//动态组件名映射
const components = {
	'info': Info,
	'orderList': OrderList,
	'userlist': UserList
}
const component = ref('info')

//侧边栏默认标记
const active = ref(1)



//监听侧边导航
const onChange = (index) => {
	component.value = sideberComponent[index]
	//console.log('切换到第' + index + '个导航')
}
</script>
<template>
	<p @click="piniaData.changebackgroundColor" class="header van-theme-dark">欢迎回来,{{ piniaData.datas.userInfo.username }}
		<span v-show="piniaData.datas.config.backgroundColor === 'light'">☀️</span>
		<span v-show="piniaData.datas.config.backgroundColor === 'dark'">🌙</span>
	</p>

	<van-sidebar class="sidebar" v-model="active" @change="onChange">
		<van-sidebar-item class="sidebarItem" title="下级管理" />
		<van-sidebar-item class="sidebarItem" title="个人信息" />

		<van-sidebar-item class="sidebarItem" title="订单管理" />
	</van-sidebar>

	<component class="connect" :is="components[component]"></component>
</template>
<style scoped>
.header {
	font-size: 1.5rem;
	z-index: 999;
	text-align: center;
	width: 100vw;
	height: 5vh;
	position: fixed;
	top: 0;
}

.sidebar {
	position: fixed;
	left: 0;
	top: 5vh;
	width: 25vmin;
	height: 45vh;

}

.connect {
	width: 75vw;
	margin-top: 5vh;
	margin-left: 25vmin;
}
</style>
