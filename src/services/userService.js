// src/services/userService.js
import axios from "axios";
import API_CONFIG from "@/config/api";

// 获取用户信息
export const getUserInfo = async (userId) => {
  try {
    const response = await axios.get(`${API_CONFIG.API_USERS_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

// 获取用户列表
export const getUserList = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.API_USERS_URL}/users`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching user list:', error);
    throw error; 
  }
};

// 登录用户
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_CONFIG.API_USERS_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// 注册用户
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_CONFIG.API_USERS_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// 更新用户信息
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_CONFIG.API_USERS_URL}/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user info:', error);
    throw error;
  }
};

// 删除用户
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_CONFIG.API_USERS_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};