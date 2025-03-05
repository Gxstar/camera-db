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

export const getBrandList = async () => {
  try {
    const response = await instance.get(API_CONFIG.BRAND_LIST);
    return response.data;
  } catch (error) {
    console.error('获取品牌列表失败:', error);
    throw error;
  }
};

export const getBrandDetail = async (brandId) => {
  try {
    const response = await instance.get(API_CONFIG.BRAND_DETAIL(brandId));
    return response.data;
  } catch (error) {
    console.error('获取品牌详情失败:', error);
    throw error;
  }
};

export const createBrand = async (brandData) => {
  try {
    const response = await instance.post(API_CONFIG.BRAND_LIST, brandData);
    return response.data;
  } catch (error) {
    console.error('创建品牌失败:', error);
    throw error;
  }
};

export const updateBrand = async (brandId, brandData) => {
  try {
    const response = await instance.put(API_CONFIG.BRAND_DETAIL(brandId), brandData);
    return response.data;
  } catch (error) {
    console.error('更新品牌失败:', error);
    throw error;
  }
};

export const deleteBrand = async (brandId) => {
  try {
    const response = await instance.delete(API_CONFIG.BRAND_DETAIL(brandId));
    return response.data;
  } catch (error) {
    console.error('删除品牌失败:', error);
    throw error;
  }
};

export default instance;