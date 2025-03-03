<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="brandName" label="品牌名称" width="180" />
    <el-table-column prop="country" label="国家" width="180" />
    <el-table-column prop="establishedYear" label="成立年份" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary" @click="handleAdd">添加品牌</el-button>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    brandName: 'Canon',
    country: '日本',
    establishedYear: '1937'
  },
  {
    brandName: 'Nikon',
    country: '日本',
    establishedYear: '1917'
  }
])

const handleEdit = (index, row) => {
  console.log(index, row)
}

const handleDelete = (index, row) => {
  console.log(index, row)
}

const handleAdd = () => {
  console.log('添加品牌')
}
</script>