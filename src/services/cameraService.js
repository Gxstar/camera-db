import axios from 'axios';
import API_CONFIG from '@/config/api';
import { userAuthStore } from '@/stores/counter';

const instance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const authStore = userAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = userAuthStore();
      authStore.logout();
    }
    return Promise.reject(error);
  }
);

export const getCameraList = async () => {
  try {
    const response = await instance.get(API_CONFIG.CAMERA_LIST);
    return response.data;
  } catch (error) {
    console.error('获取相机列表失败:', error);
    throw error;
  }
};

export const getCameraDetail = async (cameraId) => {
  try {
    const response = await instance.get(API_CONFIG.CAMERA_DETAIL(cameraId));
    return response.data;
  } catch (error) {
    console.error('获取相机详情失败:', error);
    throw error;
  }
};

export const createCamera = async (cameraData) => {
  try {
    const response = await instance.post(API_CONFIG.CAMERA_LIST, cameraData);
    return response.data;
  } catch (error) {
    console.error('创建相机失败:', error);
    throw error;
  }
};

export const updateCamera = async (cameraId, cameraData) => {
  try {
    const response = await instance.put(API_CONFIG.CAMERA_DETAIL(cameraId), cameraData);
    return response.data;
  } catch (error) {
    console.error('更新相机失败:', error);
    throw error;
  }
};

export const deleteCamera = async (cameraId) => {
  try {
    const response = await instance.delete(API_CONFIG.CAMERA_DETAIL(cameraId));
    return response.data;
  } catch (error) {
    console.error('删除相机失败:', error);
    throw error;
  }
};

export default instance;