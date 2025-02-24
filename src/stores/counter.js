import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref({
    id: null,
    username: null,
    email: null,
    role: null,
    token: null,
    avatar: null,
    createdAt: null,
    updatedAt: null
  })

  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  function login(userData) {
    isLoggedIn.value = true
    userInfo.value = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      token: userData.token,
      avatar: userData.avatar,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }
  }

  function logout() {
    isLoggedIn.value = false
    userInfo.value = {
      id: null,
      username: null,
      email: null,
      role: null,
      token: null,
      avatar: null,
      createdAt: null,
      updatedAt: null
    }
  }

  return {
    isLoggedIn,
    userInfo,
    isAdmin,
    login,
    logout
  }
})
