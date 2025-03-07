import axios from 'axios';
import API_CONFIG from '@/config/api';
import { userAuthStore } from '@/stores/counter';

const instance = axios.create({
  // 这里 baseURL 有误，应该修改为 API_CONFIG 里的实际基础地址
  baseURL: API_CONFIG.API_BASE_URL, 
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

// 获取镜头列表
export const getLensList = async () => {
  try {
    const response = await instance.get(API_CONFIG.LENSE_LIST);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 创建镜头
export const createLens = async (lensData) => {
  try {
    const response = await instance.post(API_CONFIG.LENSE_LIST, lensData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 更新镜头
export const updateLens = async (id, lensData) => {
  try {
    // 修改为使用 API_CONFIG 里的 LENSE_DETAIL 函数来生成 URL
    const response = await instance.put(API_CONFIG.LENSE_DETAIL(id), lensData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 删除镜头
export const deleteLens = async (id) => {
  try {
    // 修改为使用 API_CONFIG 里的 LENSE_DETAIL 函数来生成 URL
    await instance.delete(API_CONFIG.LENSE_DETAIL(id));
  } catch (error) {
    throw error;
  }
};