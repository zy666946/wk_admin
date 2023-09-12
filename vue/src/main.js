/*
 * @Author: zy 319085634@qq.com
 * @Date: 2023-09-05 17:01:30
 * @LastEditors: zy 319085634@qq.com
 * @LastEditTime: 2023-09-12 23:13:02
 * @FilePath: \node\admin\vue\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import './assets/main.css'

//vant
import { ConfigProvider, Field, CellGroup, Button, Sidebar, SidebarItem, List, Cell, Search, Pagination, Popup, Switch, Tag,TreeSelect,Loading } from 'vant';

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
app.use(Tag)
app.use(TreeSelect)
app.use(Loading)
app.mount('#app')
