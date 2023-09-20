<script setup>
import { ref } from 'vue'
const globalInform = ref('')
</script>
<template>
    <div>
        <van-cell-group inset>
            <van-field v-model="globalInform" label="全体通知" autosize type="textarea" placeholder="设置全体通知" />
        </van-cell-group>
    </div>
</template>

