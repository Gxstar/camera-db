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
            <div>这是侧边栏</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
</script>

<style scoped>
.main-content {
  margin-top: 5rem;
}
</style>