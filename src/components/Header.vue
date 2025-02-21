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
      </div>
    </el-menu>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import API_CONFIG from '@/config/api';

  const activeIndex = ref('home');
  const router = useRouter();
  const brands = ref([]);

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
          // 这里可以根据品牌 ID 跳转到相应的品牌页面
          router.push(`/brands/${brandId}`);
        } else {
          router.push('/');
        }
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
  </style>
  