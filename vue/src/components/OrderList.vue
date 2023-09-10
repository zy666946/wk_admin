<script setup>
import { ref, computed } from 'vue'

//搜索内容
const searchValue = ref('')

//初始化订单数据
const data = ref([])
//模拟一万条数据
setTimeout(() => {
    for (let i = 0; i < 10000; i++) {
        data.value.push(i)
    }
})

//计算总页数
const pageCount = computed(() => Math.ceil(data.value.length / 20))

//计算当前页数据
const searchDate = (list, search) => {
    const res = list.find(item => item == search)
    return res ? [res] : []
}
//计算当前页数据
const dataShow = computed(() => searchValue.value ? searchDate(data.value, searchValue.value) : data.value.slice(currentPage.value * 20 - 20, currentPage.value * 20))
//初始化选中的分页
const currentPage = ref(1)

//初始化弹出层状态
const popup = ref(false);
const showPopup = () => {
    popup.value = true;
};

</script>
<template>
    <div>
        <van-search class="orderListSearch" show-action @cancel="" v-model="searchValue" placeholder="输入订单号" />

        <van-list class="orderList">
            <!--未做懒加载（未打算）-->
            <van-cell v-for="item in dataShow" :key="item" :title="'订单编号：' + item" is-link value="查看" @click="showPopup" />
        </van-list>
        <van-popup v-model:show="popup" :style="{ padding: '64px' }">内容</van-popup>
        <van-pagination v-model="currentPage" :page-count="pageCount" :item-per-page="5" :total-items="data.length"
            :show-page-size="3" force-ellipsess />

    </div>
</template>
<style scoped>
.orderListSearch {
    height: 10vh;
    position: fixed;
    top: 5vh;
    z-index: 999;
}

.orderList {
    margin-top: 15vh;
    height: 75vh;
    overflow: auto;
}

li {
    height: 5vh;
    list-style: none;

}
</style>