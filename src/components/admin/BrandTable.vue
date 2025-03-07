<template>
  <el-table :data="paginatedData" style="width: 100%">
    <el-table-column prop="brand_name_en" label="品牌英文名" min-width="120">
      <template #default="scope">
        <span class="brand-name">{{ scope.row.brand_name_en }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="brand_name_zh" label="品牌中文名" min-width="120">
      <template #default="scope">
        <span class="brand-name">{{ scope.row.brand_name_zh }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Logo" width="80">
      <template #default="scope">
        <div class="logo-container">
          <img 
            :src="scope.row.logo_url" 
            alt="Logo" 
            class="logo-image"
          >
        </div>
      </template>
    </el-table-column>
    <el-table-column label="官网链接" width="300">
      <template #default="scope">
        <a 
          :href="scope.row.official_website" 
          target="_blank" 
          class="website-link"
          :title="scope.row.official_website"
        >
          {{ scope.row.official_website }}
        </a>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" fixed="right">
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

  <el-button type="primary" @click="handleAdd">添加品牌</el-button>

  <!-- 添加品牌对话框 -->
  <el-dialog 
    v-model="addDialogVisible" 
    title="添加品牌"
    width="30%"
    align-center
    class="brand-add-dialog"
  >
    <template #default>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="品牌英文名" prop="brand_name_en">
          <el-input v-model="addForm.brand_name_en" placeholder="请输入品牌英文名" />
        </el-form-item>
        <el-form-item label="品牌中文名" prop="brand_name_zh">
          <el-input v-model="addForm.brand_name_zh" placeholder="请输入品牌中文名" />
        </el-form-item>
        <el-form-item label="Logo URL" prop="logo_url">
          <el-input v-model="addForm.logo_url" placeholder="请输入Logo URL" />
        </el-form-item>
        <el-form-item label="官网链接" prop="official_website">
          <el-input v-model="addForm.official_website" placeholder="请输入官网链接" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitAdd">添加</el-button>
    </template>
  </el-dialog>

  <!-- 编辑品牌对话框 -->
  <el-dialog 
    v-model="editDialogVisible" 
    title="编辑品牌信息"
    width="30%"
    align-center
    class="brand-edit-dialog"
  >
    <template #default>
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="品牌英文名" prop="brand_name_en">
          <el-input v-model="editForm.brand_name_en" placeholder="请输入品牌英文名" />
        </el-form-item>
        <el-form-item label="品牌中文名" prop="brand_name_zh">
          <el-input v-model="editForm.brand_name_zh" placeholder="请输入品牌中文名" />
        </el-form-item>
        <el-form-item label="Logo URL" prop="logo_url">
          <el-input v-model="editForm.logo_url" placeholder="请输入Logo URL" />
        </el-form-item>
        <el-form-item label="官网链接" prop="official_website">
          <el-input v-model="editForm.official_website" placeholder="请输入官网链接" />
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
import { ElMessage } from 'element-plus';
import { getBrandList, updateBrand, deleteBrand, createBrand } from '@/services/brandService';

// 常量定义
const INITIAL_ADD_FORM = {
  brand_name_en: '',
  brand_name_zh: '',
  logo_url: '',
  official_website: ''
};
// 修改操作列宽度计算
const operationWidth = computed(() => {
  return 150; // 固定宽度
});
// 表单验证规则
const formRules = {
  brand_name_en: [
    { required: true, message: '请输入品牌英文名', trigger: 'blur' },
    { min: 2, max: 50, message: '品牌英文名长度在2到50个字符之间', trigger: 'blur' }
  ],
  brand_name_zh: [
    { required: true, message: '请输入品牌中文名', trigger: 'blur' },
    { min: 2, max: 50, message: '品牌中文名长度在2到50个字符之间', trigger: 'blur' }
  ],
  logo_url: [
    { required: true, message: '请输入Logo URL', trigger: 'blur' }
  ],
  official_website: [
    { required: true, message: '请输入官网链接', trigger: 'blur' }
  ]
};

// 状态管理
const tableData = ref([]);
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const addForm = ref({ ...INITIAL_ADD_FORM });
const editForm = ref({});
const currentEditBrandId = ref(null);
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
    const brands = await getBrandList();
    tableData.value = brands;
  } catch (error) {
    console.error('获取品牌列表失败:', error);
  }
});

// 品牌操作
const handleAdd = () => {
  addDialogVisible.value = true;
  addForm.value = { ...INITIAL_ADD_FORM };
};

const handleEdit = (brandId, brandData) => {
  editDialogVisible.value = true;
  editForm.value = { ...brandData };
  currentEditBrandId.value = brandId;
};

const handleDelete = async (brandId) => {
  try {
    await deleteBrand(brandId);
    tableData.value = tableData.value.filter(brand => brand.id !== brandId);
  } catch (error) {
    console.error('删除品牌失败:', error);
  }
};

// 表单提交
const submitAdd = async () => {
  try {
    await addFormRef.value.validate();
    const newBrand = await createBrand(addForm.value);
    tableData.value.push(newBrand);
    addDialogVisible.value = false;
    ElMessage.success('品牌添加成功');
  } catch (error) {
    if (error.name!== 'ValidateError') {
      console.error('添加品牌失败:', error);
    }
  }
};

const submitEdit = async () => {
  try {
    await editFormRef.value.validate();
    const updatedBrand = await updateBrand(currentEditBrandId.value, editForm.value);
    const index = tableData.value.findIndex(brand => brand.id === currentEditBrandId.value);
    if (index!== -1) {
      tableData.value[index] = updatedBrand;
    }
    editDialogVisible.value = false;
    ElMessage.success('品牌信息更新成功');
  } catch (error) {
    if (error.name!== 'ValidateError') {
      console.error('更新品牌信息失败:', error);
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
/* 去掉表格边框 */
.el-table {
  border: none;
}

/* 去掉单元格边框 */
.el-table td,
.el-table th.is-leaf {
  border: none;
}

/* 去掉表头底部边框 */
.el-table::before {
  height: 0;
}

/* 保持表格布局 */
.el-table {
  border-collapse: separate;
  border-spacing: 0;
}

/* 合并对话框样式 */
.brand-dialog {
  border-radius: 8px;
}

.brand-dialog .el-form-item {
  margin-bottom: 20px;
}

.brand-dialog .el-input,
.brand-dialog .el-select {
  width: 100%;
}

.brand-dialog .el-form-item:first-child {
  margin-top: 20px;
}

/* 官网链接样式 */
.website-link {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

/* Logo 容器样式 */
.logo-container {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Logo 图片样式 */
.logo-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

/* 品牌名称样式 */
.brand-name {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>