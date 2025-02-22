<template>
    <el-carousel :interval="interval" :autoplay="autoplay" :height="height" @change="handleChange">
      <el-carousel-item v-for="(item, index) in items" :key="index">
        <img :src="item.image" :alt="item.alt" class="carousel-image" />
        <div class="carousel-caption">{{ item.caption }}</div>
      </el-carousel-item>
    </el-carousel>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 轮播图数据
  const items = ref([
    { image: 'https://via.placeholder.com/800x400?text=Slide+1', alt: 'Slide 1', caption: 'Caption 1' },
    { image: 'https://via.placeholder.com/800x400?text=Slide+2', alt: 'Slide 2', caption: 'Caption 2' },
    { image: 'https://via.placeholder.com/800x400?text=Slide+3', alt: 'Slide 3', caption: 'Caption 3' },
  ]);
  
  // 轮播图配置
  const interval = ref(3000); // 自动切换时间间隔（毫秒）
  const autoplay = ref(true); // 是否自动播放
  const height = ref('400px'); // 轮播图高度
  
  // 切换事件回调
  const handleChange = (currentIndex, prevIndex) => {
    console.log(`从 ${prevIndex} 切换到 ${currentIndex}`);
  };
  </script>
  
  <style scoped>
  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .carousel-caption {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 18px;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px 20px;
    border-radius: 5px;
  }
  </style>