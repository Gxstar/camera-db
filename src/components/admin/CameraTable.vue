<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="model" label="型号" width="180" />
    <el-table-column prop="brand" label="品牌" width="180" />
    <el-table-column prop="releaseYear" label="发布年份" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary" @click="handleAdd">添加相机</el-button>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    model: 'EOS R5',
    brand: 'Canon',
    releaseYear: '2020'
  },
  {
    model: 'Z9',
    brand: 'Nikon',
    releaseYear: '2021'
  }
])

const handleEdit = (index, row) => {
  console.log(index, row)
}

const handleDelete = (index, row) => {
  console.log(index, row)
}

const handleAdd = () => {
  console.log('添加相机')
}
</script>