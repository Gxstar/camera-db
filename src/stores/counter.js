import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userAuthStore = defineStore('auth', () => {
  // 用户登录状态
  const isLoggedIn = ref(false)

  // 用户信息
  const userInfo = ref({
    username: null,
    role: null,
    avatar: null,
    token: null
  })

  // 从 localStorage 获取 token
  const token = ref(localStorage.getItem('token') || null)

  // 计算属性，判断用户是否为管理员
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  /**
   * 设置 token 到状态和 localStorage
   * @param {string} newToken 新的 token
   */
  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  /**
   * 清除 token 从状态和 localStorage
   */
  function clearToken() {
    token.value = null
    localStorage.removeItem('token')
  }

  
  // 登录函数，更新用户信息和 token
  // @param {Object} userData 用户数据，包含 access_token, username, role, avatar
   
  function login(userData) {
    isLoggedIn.value = true
    userInfo.value = {
      username: userData.username,
      role: userData.role,
      avatar: userData.avatar,
      token: userData.token
    }
    setToken(userData.token)
  }

  /**
   * 登出函数，清除用户信息和 token
   */
  function logout() {
    isLoggedIn.value = false
    userInfo.value = {
      username: null,
      role: null,
      avatar: null,
      token: null
    }
    clearToken()
  }

  return {
    isLoggedIn,
    userInfo,
    token,
    isAdmin,
    login,
    logout,
    setToken,
    clearToken
  }
})