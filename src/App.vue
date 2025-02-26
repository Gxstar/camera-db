<template>
  <div class="container">
    <Header />
    <el-row class="main-content" justify="center">
      <el-col :span="18">
        <el-row justify="space-between">
          <el-col :span="15">
            <router-view></router-view>
          </el-col>
          <el-col :span="8">
            <User v-if="!isLoggedIn"/>
            <UserInfoCom v-else/>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import User from './components/sidebar/UserCom.vue';
import UserInfoCom from './components/sidebar/UserInfoCom.vue';
import { useAuthStore } from './stores/counter.js';
import { ref } from 'vue';

const isLoggedIn = useAuthStore.isLoggedIn;
</script>

<style scoped>
.main-content {
  margin-top: 5rem;
}
</style>