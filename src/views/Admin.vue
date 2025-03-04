<template>
  <el-container>
    <el-header>
      <h1>管理后台</h1>
    </el-header>
    <el-main v-if="authStore.isAdmin">
      <el-tabs type="border-card">
        <el-tab-pane label="用户管理">
          <UserTable />
        </el-tab-pane>
        <el-tab-pane label="品牌管理">
          <BrandTable />
        </el-tab-pane>
        <el-tab-pane label="相机管理">
          <CameraTable />
        </el-tab-pane>
        <el-tab-pane label="镜头管理">
          <LensTable />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-main v-else>
      <p>您没有权限访问此页面。</p>
    </el-main>
  </el-container>
</template>

<script setup>
import { userAuthStore } from '@/stores/counter'
import UserTable from '@/components/admin/UserTable.vue'
import BrandTable from '@/components/admin/BrandTable.vue'
import CameraTable from '@/components/admin/CameraTable.vue'
import LensTable from '@/components/admin/LensTable.vue'

const authStore = userAuthStore()


</script>

<style scoped>
.el-header {
  background-color: #409EFF;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>