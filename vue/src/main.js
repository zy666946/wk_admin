import './assets/main.css'

//vant
import { ConfigProvider,Field,CellGroup,Button,Sidebar, SidebarItem,List,Cell,Search,Pagination,Popup,Switch } from 'vant';

import 'vant/lib/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'



const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ConfigProvider)
app.use(Field)
app.use(CellGroup)
app.use(Button)
app.use(Sidebar)
app.use(SidebarItem)
app.use(List)
app.use(Cell)
app.use(Search)
app.use(Pagination)
app.use(Popup)
app.use(Switch)
app.mount('#app')
