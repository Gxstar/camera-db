<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="username" label="用户名" width="180" />
    <el-table-column prop="email" label="邮箱" width="180" />
    <el-table-column prop="role" label="角色" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary" @click="handleAdd">添加用户</el-button>

  <!-- 编辑用户对话框 -->
  <el-dialog :visible.sync="editDialogVisible" title="编辑用户信息">
    <template #content>
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="editForm.role" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserList, updateUser, deleteUser } from '@/services/userService';

const tableData = ref([]);
// 控制编辑对话框的显示与隐藏
const editDialogVisible = ref(false);
// 编辑表单的数据
const editForm = ref({});
// 存储当前编辑用户的 ID
const currentEditUserId = ref(null);

// 在组件挂载时获取用户列表
onMounted(async () => {
  try {
    const users = await getUserList();
    tableData.value = users;
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
});

const handleEdit = (userId, userData) => {
  // 显示编辑对话框
  editDialogVisible.value = true;
  // 复制用户数据到编辑表单
  editForm.value = { ...userData };
  // 记录当前编辑用户的 ID
  currentEditUserId.value = userId;
};

const submitEdit = async () => {
  try {
    const updatedUser = await updateUser(currentEditUserId.value, editForm.value);
    // 更新表格数据
    const index = tableData.value.findIndex(user => user.id === currentEditUserId.value);
    if (index!== -1) {
      tableData.value[index] = updatedUser;
    }
    // 关闭编辑对话框
    editDialogVisible.value = false;
    console.log('用户信息更新成功:', updatedUser);
  } catch (error) {
    console.error('更新用户信息失败:', error);
  }
};

const handleDelete = async (userId) => {
  try {
    await deleteUser(userId);
    // 从表格数据中移除已删除的用户
    tableData.value = tableData.value.filter(user => user.id!== userId);
    console.log('用户删除成功');
  } catch (error) {
    console.error('删除用户失败:', error);
  }
};

const handleAdd = () => {
  console.log('添加用户');
  // 这里可以添加打开添加用户表单的逻辑
};
</script>