<template>
    <el-card>
        <template #header>
            <div class="login-header">
                <span>用户登录</span>
            </div>
        </template>
        <el-form :model="loginForm" :rules="rules" label-width="80px" label-position="top" class="login-form">
            <el-form-item label="用户名">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock"
                    show-password />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="card-footer">
                <el-button @click="handleRegister" round>注册</el-button>
                <el-button type="primary" @click="handleLogin" round>登录</el-button>
            </div>
        </template>
    </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, Lock } from '@element-plus/icons-vue'; // 确保导入图标组件
import { login,register } from '@/services/userService';
import { useAuthStore } from '@/stores/counter.js';

const router = useRouter();
const loginForm = ref({
    username: '',
    password: ''
});

const rules = ref({
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' },
        { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/, message: '密码必须包含字母和数字', trigger: 'blur' }
    ]
});

const handleLogin = async() => {
    // 假设登录成功
    const loginData=await login(loginForm.value).then(res => {
        console.log(res);  
    })
    useAuthStore.login(loginData)
    console.log('Login:', loginForm.value);
}

const handleRegister = async() => {
    register(loginForm.value).then(res => {
        console.log(res);
    })
    console.log('Register:', loginForm.value);
}

</script>

<style scoped>
.card-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
}


</style>