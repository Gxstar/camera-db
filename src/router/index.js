import { createRouter, createWebHistory } from 'vue-router';

// 这里假设这些组件在对应的路径下，你需要根据实际情况调整
import Home from '../views/Home.vue';
import Brand from '../views/Brand.vue';
import Camera from '../views/Camera.vue';
import Lens from '../views/Lens.vue';
import About from '../views/About.vue';
import Admin from '@/views/Admin.vue';

const routes = [
  {
    path: '/brand',
    name: 'Brand',
    component: Brand
  },
  {
    path: '/camera',
    name: 'Camera',
    component: Camera
  },
  {
    path: '/lens',
    name: 'Lens',
    component: Lens
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
