<template>
  <div class="container">
    <Header />
    <div class="main-content">
      <el-row justify="center" :gutter="20">
        <el-col :span="15">
          <router-view></router-view>
        </el-col>
        <el-col :span="6">
          <User v-if="!isLoggedIn"/>
          <UserInfoCom v-else/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import User from './components/sidebar/UserCom.vue';
import UserInfoCom from './components/sidebar/UserInfoCom.vue';
import { userAuthStore } from '@/stores/counter';
import { ref,computed } from 'vue';

const authStore = userAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
</script>

<style scoped>
.main-content {
  margin-top: 5rem;
  max-width: 70%;  /* 使用百分比宽度 */
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

@media (min-width: 1920px) {
  .main-content {
    max-width: 1536px;  /* 在1920px以上屏幕限制最大宽度 */
  }
}
</style>