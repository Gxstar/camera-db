<template>
  <el-container>
    <el-header>
      <h1>管理后台</h1>
    </el-header>
    <el-main>
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
  </el-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { userAuthStore } from '@/stores/counter'
import UserTable from '@/components/admin/UserTable.vue'
import BrandTable from '@/components/admin/BrandTable.vue'
import CameraTable from '@/components/admin/CameraTable.vue'
import LensTable from '@/components/admin/LensTable.vue'

const authStore = userAuthStore()

onMounted(() => {
  if (!authStore.isAdmin) {
    // 如果不是管理员，重定向到首页
    router.push('/')
  }
})
</script>

<style scoped>
.el-header {
  background-color: #409EFF;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>