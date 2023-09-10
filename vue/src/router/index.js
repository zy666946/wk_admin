import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/Login.vue'
import register from '../views/Register.vue'
import admin from '../views/Admin.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
	{
		path: '/',
		redirect: '/admin',
		children:[
			{
				path: '/login',
        			name: 'login',
        			component: login
   			},
			{
				path: '/register',
				name: 'register',
				component: register
			}
		]
	},
	  {
		path: '/admin',
		name: 'admin',
		component: admin

	  }
  ]
})

export default router
