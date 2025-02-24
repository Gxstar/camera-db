<template>
    <el-card>
        <template #header>
            <div class="user-info" @click="goToAdmin">
                <el-avatar src="https://via.placeholder.com/50" />
                <span class="username">用户名</span>
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
const goToAdmin = () => {
    router.push('/admin')
}
</script>