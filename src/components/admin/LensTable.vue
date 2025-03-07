<template>
  <div class="filter-container" style="display: flex; gap: 16px; margin-bottom: 20px;">
    <el-input
      v-model="searchQuery"
      placeholder="搜索型号"
      clearable
      style="width: 240px;"
      @input="handleSearch"
    />
    <el-select 
      v-model="selectedBrandId" 
      placeholder="请选择品牌"
      clearable
      @change="handleBrandFilter"
      style="width: 240px;"
    >
      <el-option
        v-for="brand in brandList"
        :key="brand.id"
        :label="brand.brand_name_zh"
        :value="brand.id"
      />
    </el-select>
    <el-select
      v-model="selectedMount"
      placeholder="请选择卡口"
      clearable
      @change="handleMountFilter"
      style="width: 240px;"
    >
      <el-option
        v-for="mount in mountOptions"
        :key="mount"
        :label="mount"
        :value="mount"
      />
    </el-select>
  </div>

  <el-table :data="paginatedData" style="width: 100%">
    <el-table-column prop="model" label="型号" min-width="120" />
    <el-table-column label="品牌" width="180">
      <template #default="scope">
        {{ brandList.find(brand => brand.id === scope.row.brand_id)?.brand_name_zh || '未知品牌' }}
      </template>
    </el-table-column>
    <el-table-column label="卡口" prop="mount" />
    <el-table-column label="焦距范围">
      <template #default="scope">
        {{ scope.row.min_focal_length }}-{{ scope.row.max_focal_length }}mm
      </template>
    </el-table-column>
    <el-table-column label="光圈范围">
      <template #default="scope">
        f/{{ scope.row.min_aperture }}-f/{{ scope.row.max_aperture }}
      </template>
    </el-table-column>
    <el-table-column label="图片" width="80">
      <template #default="scope">
        <div class="image-container">
          <img 
            :src="scope.row.image_url" 
            alt="Lens" 
            class="lens-image"
          >
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :total="filteredData.length"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-button type="primary" @click="handleAdd">添加镜头</el-button>

  <!-- 添加镜头对话框 -->
  <el-dialog 
    v-model="addDialogVisible" 
    title="添加镜头"
    width="30%"
    align-center
  >
    <template #default>
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item label="型号" prop="model">
          <el-input v-model="addForm.model" placeholder="请输入镜头型号" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand_id">
          <el-select v-model="addForm.brand_id" placeholder="请选择品牌" clearable>
            <el-option
              v-for="brand in brandList"
              :key="brand.id"
              :label="brand.brand_name_zh"
              :value="brand.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡口" prop="mount">
          <el-select v-model="addForm.mount" placeholder="请选择卡口" clearable>
            <el-option
              v-for="mount in mountOptions"
              :key="mount"
              :label="mount"
              :value="mount"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="焦距范围" prop="min_focal_length">
          <el-input-number v-model="addForm.min_focal_length" placeholder="最小焦距" />
          <span style="margin: 0 8px">-</span>
          <el-input-number v-model="addForm.max_focal_length" placeholder="最大焦距" />
        </el-form-item>
        <el-form-item label="光圈范围" prop="min_aperture">
          <el-input-number v-model="addForm.min_aperture" placeholder="最小光圈" />
          <span style="margin: 0 8px">-</span>
          <el-input-number v-model="addForm.max_aperture" placeholder="最大光圈" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="发布日期" prop="release_date">
          <el-date-picker
            v-model="addForm.release_date"
            type="date"
            placeholder="选择发布日期"
          />
        </el-form-item>
        <el-form-item label="图片URL" prop="image_url">
          <el-input v-model="addForm.image_url" placeholder="请输入图片URL" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitAdd">添加</el-button>
    </template>
  </el-dialog>

  <!-- 编辑镜头对话框 -->
  <el-dialog 
    v-model="editDialogVisible" 
    title="编辑镜头信息"
    width="30%"
    align-center
  >
    <template #default>
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item label="型号" prop="model">
          <el-input v-model="editForm.model" placeholder="请输入镜头型号" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand_id">
          <el-select v-model="editForm.brand_id" placeholder="请选择品牌" clearable>
            <el-option
              v-for="brand in brandList"
              :key="brand.id"
              :label="brand.brand_name_zh"
              :value="brand.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡口" prop="mount">
          <el-select v-model="editForm.mount" placeholder="请选择卡口" clearable>
            <el-option
              v-for="mount in mountOptions"
              :key="mount"
              :label="mount"
              :value="mount"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="焦距范围" prop="min_focal_length">
          <el-input-number v-model="editForm.min_focal_length" placeholder="最小焦距" />
          <span style="margin: 0 8px">-</span>
          <el-input-number v-model="editForm.max_focal_length" placeholder="最大焦距" />
        </el-form-item>
        <el-form-item label="光圈范围" prop="min_aperture">
          <el-input-number v-model="editForm.min_aperture" placeholder="最小光圈" />
          <span style="margin: 0 8px">-</span>
          <el-input-number v-model="editForm.max_aperture" placeholder="最大光圈" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="发布日期" prop="release_date">
          <el-date-picker
            v-model="editForm.release_date"
            type="date"
            placeholder="选择发布日期"
          />
        </el-form-item>
        <el-form-item label="图片URL" prop="image_url">
          <el-input v-model="editForm.image_url" placeholder="请输入图片URL" />
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getLensList, updateLens, deleteLens, createLens } from '@/services/lensService'
import { getBrandList } from '@/services/brandService'

const searchQuery = ref('')
const selectedBrandId = ref(null)
const selectedMount = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const currentEditLensId = ref(null)

const tableData = ref([])
const brandList = ref([])
const mountOptions = ['EF', 'EF-S', 'RF', 'F', 'Z', 'E', 'X','MTF']

const INITIAL_ADD_FORM = {
  model: '',
  brand_id: '',
  mount: '',
  min_focal_length: '',
  max_focal_length: '',
  min_aperture: '',
  max_aperture: '',
  price: '',
  release_date: '',
  image_url: ''
}

const addForm = ref({ ...INITIAL_ADD_FORM })
const editForm = ref({ ...INITIAL_ADD_FORM })

const formRules = {
  model: [{ required: true, message: '请输入镜头型号', trigger: 'blur' }],
  brand_id: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  mount: [{ required: true, message: '请选择卡口', trigger: 'change' }],
  min_focal_length: [{ required: true, message: '请输入最小焦距', trigger: 'blur' }],
  max_focal_length: [{ required: true, message: '请输入最大焦距', trigger: 'blur' }],
  min_aperture: [{ required: true, message: '请输入最小光圈', trigger: 'blur' }],
  max_aperture: [{ required: true, message: '请输入最大光圈', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  release_date: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
  image_url: [{ required: true, message: '请输入图片URL', trigger: 'blur' }]
}

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const matchesSearch = item.model.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesBrand = selectedBrandId.value ? item.brand_id === selectedBrandId.value : true
    const matchesMount = selectedMount.value ? item.mount === selectedMount.value : true
    return matchesSearch && matchesBrand && matchesMount
  })
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 获取品牌列表
const fetchBrandList = async () => {
  try {
    brandList.value = await getBrandList()
  } catch (error) {
    console.error('获取品牌列表失败:', error)
  }
}

// 获取镜头列表
const fetchLensList = async () => {
  try {
    tableData.value = await getLensList()
  } catch (error) {
    console.error('获取镜头列表失败:', error)
    tableData.value = []; // 确保 tableData.value 是一个空数组
  }
};

// 初始化数据
onMounted(() => {
  fetchBrandList()
  fetchLensList()
})

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1;
};

const handleBrandFilter = () => {
  currentPage.value = 1;
};

const handleMountFilter = () => {
  currentPage.value = 1;
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1;
  // 重新计算分页数据
  paginatedData.value = filteredData.value.slice(
    (currentPage.value - 1) * pageSize.value,
    (currentPage.value - 1) * pageSize.value + pageSize.value
  );
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  // 重新计算分页数据
  paginatedData.value = filteredData.value.slice(
    (currentPage.value - 1) * pageSize.value,
    (currentPage.value - 1) * pageSize.value + pageSize.value
  );
};

// 添加镜头
const handleAdd = () => {
  addForm.value = { ...INITIAL_ADD_FORM };
  addDialogVisible.value = true;
};

const submitAdd = async () => {
  try {
    const newLens = await createLens(addForm.value);
    // 重新获取镜头列表
    await fetchLensList();
    addDialogVisible.value = false;
    ElMessage.success('镜头添加成功');
  } catch (error) {
    console.error('添加镜头失败:', error);
    ElMessage.error('镜头添加失败');
  }
};

// 编辑镜头
const handleEdit = (id, row) => {
  currentEditLensId.value = id;
  editForm.value = { ...row };
  editDialogVisible.value = true;
};

const submitEdit = async () => {
  try {
    const updatedLens = await updateLens(currentEditLensId.value, editForm.value);
    // 重新获取镜头列表
    await fetchLensList();
    editDialogVisible.value = false;
    ElMessage.success('镜头信息更新成功');
  } catch (error) {
    console.error('更新镜头信息失败:', error);
    ElMessage.error('镜头信息更新失败');
  }
};

// 删除镜头
const handleDelete = async (id) => {
  try {
    await deleteLens(id)
    tableData.value = tableData.value.filter(lens => lens.id !== id)
    ElMessage.success('镜头删除成功')
  } catch (error) {
    console.error('删除镜头失败:', error)
    ElMessage.error('镜头删除失败')
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}

.image-container {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lens-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>