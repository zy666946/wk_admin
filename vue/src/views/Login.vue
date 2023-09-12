<script setup>
//导入vant提供的 记载中，成功，失败 的轻弹窗函数
//需要时直接调用即可，可传入参数设置是否可点击背景和显示文字等。
import { showLoadingToast, showSuccessToast, showFailToast } from 'vant';
import { useRouter } from "vue-router"
import axios from 'axios'
import { ref } from 'vue'
import { usePiniaData } from '../stores/counter';
import config from '../../config.json'

const piniaData = usePiniaData()
//声明路由实例
const router = useRouter()
//声明路由传参函数
const changeRoute = (name) => {
	router.push({ name: name })
}

//声明账号和密码的 ref 代理变量
const userName = ref(''),
	passWord = ref(''),
	//声明是否记住密码变量
	remember = ref(true)
//声明本地账号信息
const storagePassword = JSON.parse(window.localStorage.getItem('storagePassword'))
//本地账户信息存在则赋值   注：只能复制给 ref 变量的 .value属性，否则代理变量失效。 
if (storagePassword) {
	userName.value = storagePassword.userName
	passWord.value = storagePassword.passWord
}

//登录事件请求函数
const login = async () => {
	try {
		showLoadingToast({
			//文字提示
			message: '',
			//背景是否禁用点击
			forbidClick: true,
		});

		const res = await axios({
			method: 'post',
			url: config.serverUrl + ':' + config.serverPort + '/login',
			data: {
				userName: userName.value,
				passWord: passWord.value
			}
		})
		//console.log(res.data)
		//判断返回状态为登录成功
		if (res.data.status === 1) {
			//将返回token存入本地
			//加密后的token必须要加Bearer 前缀，否则之后服务器无法识别
			window.localStorage.setItem('token', 'Bearer ' + res.data.token);
			//弹出提示
			showSuccessToast({ message: '登录成功' });
			//记住密码本地存入账号信息
			if (remember.value) {
				//记住密码，将本次登录的账号密码存入本地
				const jsonData = JSON.stringify({
					userName: userName.value,
					passWord: passWord.value
				})
				window.localStorage.setItem('storagePassword', jsonData)
			} else {
				window.localStorage.removeItem('storagePassword')
			}
			//调整路由
			setTimeout(() => {
				router.push({ name: 'admin' })
			}, 1500)

		} else {
			showFailToast(res.data.message);
		}
	} catch (error) {
		console.log(error.message)
	}
}
</script>
<template>
	<div class='loginArea'>
		<van-cell-group class='inputArea' inset>
			<van-field v-model='userName' class='input' type='text' label="用户名：" placeholder="请输入用户名" />
			<van-field v-model='passWord' class='input' type='password' label='密码：' placeholder='请输入密码' />
		</van-cell-group>

		<div class='checkBoxArea'>
			<label>
				<input v-model='remember' class='checkbox' type='checkbox'>
				<span style='position: relative;bottom: 1vw'>记住密码</span>


			</label>
			<span style='color: rgb(23,164,255); cursor: pointer;'>忘记密码？</span>
		</div>
		<div class='btnArea'>
			<button @click='login' class='loginBtn'>登录</button>
			<button @click="changeRoute('register')" class='registerBtn'>注册</button>
		</div>

	</div>
</template>
<style scoped>
.loginArea {
	margin: 0 auto;
	margin-top: 15vh;
	width: 85vw;
	height: 60vh;

}

.inputArea {
	width: 100%;
	height: 20vh;
}

.input {
	height: 10vh;
}

.checkBoxArea {
	display: flex;
	justify-content: space-around;
	width: 100%;
	height: 5vw;
	margin-bottom: 5vw;
}

.checkBoxArea span {
	line-height: 1;
	color: #666;
}

.checkbox {
	margin-right: 1rem;
	width: 1rem;
	height: 1rem;
	float: left;

}

.btnArea {
	display: flex;
	justify-content: space-around;
}

.loginBtn,
.registerBtn {
	height: 2rem;
	width: 30vw;
	cursor: pointer;
}

.loginBtn {
	background: rgb(23, 164, 255);
	border: none;
	border-radius: 5px;
	color: white;
}

.registerBtn {
	background: white;
	border: 1px solid #888;
	border-radius: 5px;
	color: #666;
}
</style>
