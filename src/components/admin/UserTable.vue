<template>
  <el-table :data="paginatedData" style="width: 100%">
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

  <!-- 分页 -->
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :total="tableData.length"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-button type="primary" @click="handleAdd">添加用户</el-button>

  <!-- 添加用户对话框 -->
  <el-dialog 
    v-model="addDialogVisible" 
    title="添加用户"
    width="30%"
    align-center
    class="user-add-dialog"
  >
    <template #default>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="头像地址">
          <el-input v-model="addForm.avatar" placeholder="请输入头像URL" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitAdd">添加</el-button>
    </template>
  </el-dialog>

  <!-- 编辑用户对话框 -->
  <el-dialog 
    v-model="editDialogVisible" 
    title="编辑用户信息"
    width="30%"
    align-center
    class="user-edit-dialog"
  >
    <template #default>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="头像地址">
          <el-input v-model="editForm.avatar" placeholder="请输入头像URL" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
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
import { ref, computed, onMounted } from 'vue';
import { getUserList, updateUser, deleteUser, register } from '@/services/userService';

// 常量定义
const INITIAL_ADD_FORM = {
  username: '',
  password: '',
  email: '',
  avatar: '',
  role: 'user'
};

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
};

// 状态管理
const tableData = ref([]);
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const addForm = ref({ ...INITIAL_ADD_FORM });
const editForm = ref({});
const currentEditUserId = ref(null);
const currentPage = ref(1);
const pageSize = ref(20);

// 表单引用
const addFormRef = ref(null);
const editFormRef = ref(null);

// 计算属性
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// 初始化
onMounted(async () => {
  try {
    const users = await getUserList();
    tableData.value = users;
  } catch (error) {
    console.error('获取用户列表失败:', error);
  }
});

// 用户操作
const handleAdd = () => {
  addDialogVisible.value = true;
  addForm.value = { ...INITIAL_ADD_FORM };
};

const handleEdit = (userId, userData) => {
  editDialogVisible.value = true;
  editForm.value = { ...userData };
  currentEditUserId.value = userId;
};

const handleDelete = async (userId) => {
  try {
    await deleteUser(userId);
    tableData.value = tableData.value.filter(user => user.id !== userId);
  } catch (error) {
    console.error('删除用户失败:', error);
  }
};

// 表单提交
const submitAdd = async () => {
  try {
    await addFormRef.value.validate();
    const newUser = await register(addForm.value);
    tableData.value.push(newUser);
    addDialogVisible.value = false;
  } catch (error) {
    if (error.name !== 'ValidateError') {
      console.error('添加用户失败:', error);
    }
  }
};

const submitEdit = async () => {
  try {
    await editFormRef.value.validate();
    const updatedUser = await updateUser(currentEditUserId.value, editForm.value);
    const index = tableData.value.findIndex(user => user.id === currentEditUserId.value);
    if (index !== -1) {
      tableData.value[index] = updatedUser;
    }
    editDialogVisible.value = false;
  } catch (error) {
    if (error.name !== 'ValidateError') {
      console.error('更新用户信息失败:', error);
    }
  }
};

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};
</script>

<style scoped>
/* 合并对话框样式 */
.user-dialog {
  border-radius: 8px;
}

.user-dialog .el-form-item {
  margin-bottom: 20px;
}

.user-dialog .el-input,
.user-dialog .el-select {
  width: 100%;
}

.user-dialog .el-form-item:first-child {
  margin-top: 20px;
}
</style>