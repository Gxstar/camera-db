<template>
    <el-card class="user-info-card">
        <!-- 使用 header 插槽放置头像 -->
        <template #header>
            <div class="user-avatar-container">
                <!-- 添加 @click 事件绑定 -->
                <el-avatar :src="authStore.userInfo.avatar || 'https://via.placeholder.com/50'" size="large" class="user-avatar" @click="goToAdmin" />
            </div>
        </template>
        <!-- 卡片主体部分放置用户名 -->
        <div class="user-details">
            <!-- 添加 @click 事件绑定 -->
            <span class="username" @click="goToAdmin">{{ authStore.userInfo.username || '用户名' }}</span>
        </div>
        <!-- 使用 footer 插槽放置退出登录按钮 -->
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
    router.push('/admin');
};

const handleLogout = () => {
    authStore.logout();
    router.push('/'); // 退出后跳转到登录页面
};
</script>

<style scoped>
/* 定义 CSS 变量 */
:root {
    --primary-color: #409eff;
    --secondary-color: #909399;
    --background-color: #f5f7fa;
    --border-color: #e4e7ed;
    --spacing: 16px;
}

.user-info-card {
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: var(--spacing);
    text-align: center; /* 让内部元素居中 */
}

.user-avatar-container {
    margin-bottom: var(--spacing);
}

.user-avatar {
    margin: 0 auto; /* 让头像水平居中 */
    cursor: pointer; /* 鼠标指针变为手型 */
    transition: filter 0.3s ease; /* 添加过渡效果 */
}

.user-avatar:hover {
    filter: brightness(1.1); /* 鼠标悬停时提高亮度 */
}

.user-details {
    margin-bottom: var(--spacing);
}

.username {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-color);
    cursor: pointer; /* 鼠标指针变为手型 */
    transition: color 0.3s ease; /* 添加过渡效果 */
}

.username:hover {
    color: #ff6600; /* 鼠标悬停时改变文字颜色 */
    text-decoration: underline; /* 鼠标悬停时添加下划线 */
}

.card-footer {
    display: flex;
    justify-content: center;
}
</style>