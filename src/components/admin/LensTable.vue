<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="model" label="型号" width="180" />
    <el-table-column prop="brand" label="品牌" width="180" />
    <el-table-column prop="focalLength" label="焦距" />
    <el-table-column prop="aperture" label="光圈" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary" @click="handleAdd">添加镜头</el-button>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    model: 'RF 24-70mm F2.8L IS USM',
    brand: 'Canon',
    focalLength: '24-70mm',
    aperture: 'f/2.8'
  },
  {
    model: 'NIKKOR Z 24-70mm f/2.8 S',
    brand: 'Nikon',
    focalLength: '24-70mm',
    aperture: 'f/2.8'
  }
])

const handleEdit = (index, row) => {
  console.log(index, row)
}

const handleDelete = (index, row) => {
  console.log(index, row)
}

const handleAdd = () => {
  console.log('添加镜头')
}
</script>