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

export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await instance.post(API_CONFIG.USER_LOGIN, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const authStore = userAuthStore();
    authStore.login({
      username: response.data.username,
      role: response.data.role,
      avatar: response.data.avatar,
      token: response.data.access_token
    });

    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await instance.post(API_CONFIG.USER_REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

export const getUserList = async () => {
  try {
    const response = await instance.get(API_CONFIG.USER_LIST);
    return response.data;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

export const getUserDetail = async (userId) => {
  try {
    const response = await instance.get(API_CONFIG.USER_DETAIL(userId));
    return response.data;
  } catch (error) {
    console.error('获取用户详情失败:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await instance.put(API_CONFIG.USER_DETAIL(userId), userData);
    return response.data;
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await instance.delete(API_CONFIG.USER_DETAIL(userId));
    return response.data;
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
};

export default instance;
