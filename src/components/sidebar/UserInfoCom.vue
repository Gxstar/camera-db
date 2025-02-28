<template>
    <el-card>
        <template #header>
            <div class="user-info" @click="goToAdmin">
                <el-avatar :src="authStore.userInfo.avatar || 'https://via.placeholder.com/50'" />
                <span class="username">{{ authStore.userInfo.username || '用户名' }}</span>
            </div>
        </template>
        <template #footer>
            <div class="card-footer">
                <el-button type="danger" @click="handleLogout" round>退出登录</el-button>
            </div>
        </template>
    </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { userAuthStore } from '@/stores/counter';

const router = useRouter();
const authStore = userAuthStore();
const goToAdmin = () => {
    router.push('/admin')
}
const handleLogout = () => {
    authStore.logout();
    router.push('/'); // 退出后跳转到登录页面
}
</script>