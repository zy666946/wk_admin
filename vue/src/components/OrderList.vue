<!--
 * @Author: zy 319085634@qq.com
 * @Date: 2023-09-05 17:01:30
 * @LastEditors: zy 319085634@qq.com
 * @LastEditTime: 2023-09-13 02:47:33
 * @FilePath: \node\admin\vue\src\components\OrderList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { ref, computed } from 'vue'

//搜索内容
const searchValue = ref('')

//初始化订单数据
const data = ref([])
//模拟一万条数据
setTimeout(() => {
    for (let i = 0; i < 10000; i++) {
        data.value.push({
            number: i,
            userId: 1,
            phone: 123456,
            status: '进行中',
            time: '2023-9-12'
        })
    }
})

//计算总页数
const pageCount = computed(() => Math.ceil(data.value.length / 20))

//计算搜索结果
const searchDate = (list, search) => {
    const res = list.find(item => new String(item.number).indexOf(search) != -1 || new String(item.userId).indexOf(search) != -1 || new String(item.phone).indexOf(search) != -1 || new String(item.status).indexOf(search) != -1)
    return res ? [res] : []
}
//计算当前页数据
const dataShow = computed(() => searchValue.value ? searchDate(data.value, searchValue.value) : data.value.slice(currentPage.value * 20 - 20, currentPage.value * 20))
//初始化选中的分页
const currentPage = ref(1)

//初始化订单弹出层状态
const orderPopup = ref(false);
//初始化订单弹出层内容
const orderPopupData = ref('')
//打开弹出层事件
const showPopup = (item) => {
    orderPopupData.value = item
    orderPopup.value = true;
};


//标签属性
const tagStatus = (status) => {
    if (status === '已完成') return 'success'
    else if (status === '进行中') return 'primary'
    else if (status === '异常') return 'danger'
}

</script>
<template>
    <div>
        <van-search class="orderListSearch" show-action @cancel="" v-model="searchValue" placeholder="输入查询信息" />

        <van-list class="orderList">
            <!--未做懒加载（未打算）-->
            <van-cell v-for="item in dataShow" :key="item.number" is-link value="查看" @click="showPopup(item)">
                <!-- 使用 title 插槽来自定义标题 -->
                <template #title>
                    <span class="custom-title">{{ '订单编号：' + item.number }}</span>
                    <van-tag :type="tagStatus(item.status)">{{ item.status }}</van-tag>
                </template>
            </van-cell>
            <van-loading v-show="!dataShow[0]">加载中...</van-loading>
        </van-list>
        <van-popup style="width: 80vmin;" v-model:show="orderPopup" :style="{ padding: '5vmin' }">
            <van-field class="oderPopupItem" v-model="orderPopupData.number" readonly label="订单编号："></van-field>
            <van-field class="oderPopupItem" v-model="orderPopupData.userId" readonly label="下单ID: "></van-field>
            <van-field class="oderPopupItem" v-model="orderPopupData.phone" readonly label="下单账号："></van-field>
            <van-field class="oderPopupItem" v-model="orderPopupData.status" readonly label="订单状态："></van-field>
            <van-field class="oderPopupItem" v-model="orderPopupData.time" readonly label="下单日期："></van-field>
        </van-popup>
        <van-pagination v-model="currentPage" :page-count="pageCount" :item-per-page="5" :total-items="data.length"
            :show-page-size="3" force-ellipsess />

    </div>
</template>
<style scoped>
.orderListSearch {
    width: calc(100vw - 25vmin);
    height: 10vh;
    position: fixed;
    top: 5vh;
    z-index: 999;
}

.orderList {
    margin-top: 15vh;
    height: 75vh;
    overflow: auto;
    width: calc(100vw - 25vmin);
}

.custom-title {
    margin-right: 4px;
    vertical-align: middle;
}

.oderPopupItem {
    width: 100%;
}
</style>