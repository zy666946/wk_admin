
<script setup>
import { showLoadingToast,showSuccessToast, showFailToast } from 'vant';
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import axios from 'axios'
import config from '../../config.json'

const userName = ref(''),
	passWord2 = ref(''),
	passWord = ref(''),
	alike = computed(() => passWord.value !== passWord2.value),
	email = ref(''),
	//邀请码
	yqm = ref(''),
	//验证码
	sms = ref('')
const router = useRouter()
const changeRoute = (name) => {
	router.push({ name: name })
}

const register = async()=>{
	if(userName.value === ''||passWord.value === ''||email.value === ''||passWord.value !== passWord2.value||yqm.value === ''){
		showFailToast('请完整输入信息')
		return
	}
	try {
		showLoadingToast()
		const res = await axios({
			method: 'post',
			url: config.serverUrl + ':' + config.serverPort + '/register',
			data: {
				userName: userName.value,
				passWord: passWord.value,
				email: email.value,
				yqm: yqm.value
			}
			
		})
		if(res.data.status === 1){
			showSuccessToast('注册成功')
			window.localStorage.setItem('token','Bearer ' + res.data.token);
			setTimeout(()=>{
				changeRoute('admin')
			},1500)
		}else{
			showFailToast(res.data.message)
		}
		
	} catch (error) {
		console.log(error)
	}
}

</script>
<template>
	<van-cell-group class='inputArea' inset>
		<van-field required v-model='userName' class='input' type='text' label="用户名：" placeholder="请输入用户名" />
		<van-field required v-model='passWord' class='input' type='password' label='密码：' placeholder='请输入密码' />
		<van-field required :error="alike" v-model='passWord2' class='input' type='password' label='重复密码：'
			placeholder='请重复输入密码' :error-message="alike ? '两次输入不一致' : ''" />
		<van-field required v-model='email' class='input' type='text' label="邮箱地址：" placeholder="请输入邮箱地址" />
		<van-field required v-model='yqm' class='input' type='text' label="邀请码：" placeholder="请输入邀请码" />
		<van-field disabled type="number" v-model="sms" required center clearable label="验证码" placeholder="暂未开发">
			<template #button>
				<van-button disabled size="small" type="primary">发送</van-button>
			</template>
		</van-field>
	</van-cell-group>
	<div class="btnArea">
		<van-button size='small' plain type="primary" @click="changeRoute('login')"  class='loginBtn'>返回登录</van-button>
			<van-button @click="register()" size='small' plain type="success" class='registerBtn'>立即注册</van-button>
	</div>
</template>
<style scoped>
.inputArea{
	margin-top: 10vh;
	width: 100vw;
}

.input{
	width: 100%;
}

.btnArea {
	margin-top: 5vh;;
	display: flex;
	justify-content: space-around;
}

.loginBtn,
.registerBtn {
	width: 30vw;
	cursor: pointer;
}
</style>