<script setup>
import { usePiniaData } from './stores/counter.js'
import { RouterView } from 'vue-router'
import eruda from 'eruda'
eruda.init()
const piniaData = usePiniaData()
</script>

<template>
	<van-config-provider :theme="piniaData.datas.config.backgroundColor">
		<RouterView></RouterView>
</van-config-provider>
</template>

<style scoped>
</style>
