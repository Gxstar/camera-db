<template>
  <el-menu
    :default-active="activeIndex"
    class="navbar"
    mode="horizontal"
    @select="handleSelect"
    background-color="#fff"
    text-color="#606266"
    active-text-color="#409eff"
    style="border-bottom: 1px solid #e6e6e6;"
  >
    <div class="logo-wrapper">
      <img src="/src/assets/logo.svg" alt="Logo" class="logo" />
    </div>

    <div class="menu-items">
      <el-menu-item index="home">首页</el-menu-item>
      <el-menu-item index="camera">相机</el-menu-item>
      <el-menu-item index="lens">镜头</el-menu-item>
      <el-sub-menu index="brands">
        <template #title>品牌</template>
        <el-menu-item v-for="brand in brands" :key="brand.id" :index="`brand-${brand.id}`">{{ brand.brand_name_zh}}</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="about">关于</el-menu-item>
      <el-menu-item v-if="!isLoggedIn" index="login" @click="showLoginModal">
        <el-icon><User /></el-icon>
        <span>登录</span>
      </el-menu-item>
      <el-dropdown v-else trigger="click" @command="handleDropdownCommand">
        <template #trigger>
          <img src="https://via.placeholder.com/30" alt="Avatar" class="avatar" />
        </template>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="userInfo">用户信息</el-dropdown-item>
          <el-dropdown-item command="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>

  <el-dialog 
    v-model="loginModalVisible" 
    title="登录" 
    width="400px" 
    center 
    :close-on-click-modal="false"
  >
    <el-form 
      :model="loginForm" 
      label-width="80px" 
      label-position="top" 
      class="login-form"
    >
      <el-form-item label="用户名">
        <el-input 
          v-model="loginForm.username" 
          placeholder="请输入用户名" 
          prefix-icon="User"
        />
      </el-form-item>
      <el-form-item label="密码">
        <el-input 
          v-model="loginForm.password" 
          type="password" 
          placeholder="请输入密码" 
          prefix-icon="Lock"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="loginModalVisible = false" round>取消</el-button>
      <el-button type="primary" @click="handleLogin" round>登录</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import API_CONFIG from '@/config/api';
import { User, SwitchButton, Lock } from '@element-plus/icons-vue';

const activeIndex = ref('home');
const router = useRouter();
const brands = ref([]);
const isLoggedIn = ref(false);
const loginModalVisible = ref(false);
const loginForm = ref({
  username: '',
  password: ''
});

const handleSelect = (index) => {
  activeIndex.value = index;

  switch (index) {
    case 'home':
      router.push('/');
      break;
    case 'camera':
      router.push('/camera');
      break;
    case 'lens':
      router.push('/lens');
      break;
    case 'about':
      router.push('/about');
      break;
    default:
      if (index.startsWith('brand-')) {
        const brandId = index.split('-')[1];
        router.push(`/brands/${brandId}`);
      } else {
        router.push('/');
      }
  }
};

const showLoginModal = () => {
  loginModalVisible.value = true;
};

const handleLogin = () => {
  // 这里可以添加登录逻辑，例如调用 API 进行身份验证
  // 假设登录成功
  isLoggedIn.value = true;
  loginModalVisible.value = false;
};

const handleLogout = () => {
  // 这里可以添加登出逻辑
  isLoggedIn.value = false;
};

const handleDropdownCommand = (command) => {
  switch (command) {
    case 'userInfo':
      router.push('/admin');
      break;
    case 'logout':
      handleLogout();
      break;
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(API_CONFIG.BRAND_LIST);
    brands.value = response.data;
  } catch (error) {
    console.error('Failed to fetch brands:', error);
  }
});
</script>

<style scoped>
.navbar {
  margin: 0;
  position: fixed; /* 始终保持在屏幕顶部 */
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* 设置固定高度 */
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 让 Logo 和菜单项分别在左右两端 */
  padding: 0 20px; /* 增加左右 padding */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px; /* 调整 logo 大小 */
  margin-right: 20px; /* 增加 logo 右侧间距 */
}

.menu-items {
  display: flex; /* 使菜单项水平排列 */
}

.el-menu--horizontal .el-menu-item {
  margin: 0; /* 移除 el-menu-item 的默认 margin */
}

.login-form {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  width: 100%;
}

.el-dialog__footer {
  text-align: center;
}

.el-button {
  margin: 0 10px;
}

/* 为页面内容预留空间 */
body {
  padding-top: 60px; /* 根据导航栏的高度调整 */
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 防止水平滚动条 */
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}
</style>