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
      <!-- 过滤掉 brand 为 null 的项 -->
      <el-option
        v-for="brand in brandList.filter(brand => brand !== null)"
        :key="brand.id"
        :label="brand.brand_name_zh"
        :value="brand.id"
      />
    </el-select>
    <el-select
      v-model="selectedFormat"
      placeholder="请选择画幅"
      clearable
      @change="handleFormatFilter"
      style="width: 240px;"
    >
      <el-option
        v-for="format in formatOptions"
        :key="format"
        :label="format"
        :value="format"
      />
    </el-select>
    <el-select
      v-model="selectedMount"
      placeholder="请选择卡口"
      clearable
      @change="handleMountFilter"
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
    <el-table-column prop="brand_name_zh" label="品牌" min-width="60">
      <template #default="scope">
        {{ brandList.find(brand => brand.id === scope.row.brand_id)?.brand_name_zh || '未知品牌' }}
      </template>
    </el-table-column>
    <el-table-column prop="model" label="型号" min-width="120" />
    <el-table-column prop="format" label="画幅" />
    <el-table-column prop="mount" label="卡口" />
    <el-table-column label="图片" width="80">
      <template #default="scope">
        <div class="image-container">
          <img 
            :src="scope.row.image_url" 
            alt="Camera" 
            class="camera-image"
            onerror="this.src='https://via.placeholder.com/80'"
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

  <!-- 分页 -->
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :total="filteredData.length"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />

  <el-button type="primary" @click="handleAdd">添加相机</el-button>

  <!-- 添加相机对话框 -->
  <el-dialog 
    v-model="addDialogVisible" 
    title="添加相机"
    width="30%"
    align-center
    class="camera-add-dialog"
  >
    <template #default>
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="100px">
        <el-form-item label="型号" prop="model">
          <el-input v-model="addForm.model" placeholder="请输入相机型号" />
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
        <el-form-item label="画幅" prop="format">
          <el-select v-model="addForm.format" placeholder="请选择画幅" clearable>
            <el-option
              v-for="format in formatOptions"
              :key="format"
              :label="format"
              :value="format"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="重量(g)" prop="weight">
          <el-input v-model="addForm.weight" placeholder="请输入重量" />
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
        <el-form-item label="价格" prop="price">
          <el-input v-model="addForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="像素分辨率" prop="pixel_resolution">
          <el-input v-model="addForm.pixel_resolution" placeholder="请输入像素分辨率" />
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

  <!-- 编辑相机对话框 -->
  <el-dialog 
    v-model="editDialogVisible" 
    title="编辑相机信息"
    width="30%"
    align-center
    class="camera-edit-dialog"
  >
    <template #default>
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px">
        <el-form-item label="型号" prop="model">
          <el-input v-model="editForm.model" placeholder="请输入相机型号" />
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
        <el-form-item label="画幅" prop="format">
          <el-select v-model="editForm.format" placeholder="请选择画幅" clearable>
            <el-option
              v-for="format in formatOptions"
              :key="format"
              :label="format"
              :value="format"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="重量(g)" prop="weight">
          <el-input v-model="editForm.weight" placeholder="请输入重量" />
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
        <el-form-item label="价格" prop="price">
          <el-input v-model="editForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="像素分辨率" prop="pixel_resolution">
          <el-input v-model="editForm.pixel_resolution" placeholder="请输入像素分辨率" />
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
import { getCameraList, updateCamera, deleteCamera, createCamera } from '@/services/cameraService'
import { getBrandList } from '@/services/brandService'

// 常量定义
const INITIAL_ADD_FORM = {
  model: '',
  brand_id: '',
  format: '',
  weight: '',
  mount: '',
  price: '',
  pixel_resolution: '',
  release_date: '',
  image_url: ''
}

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const tableData = ref([])
const brandList = ref([])
const selectedBrandId = ref(null)
const selectedFormat = ref(null)
const selectedMount = ref(null)
const formatOptions = ref([])
const mountOptions = ref([])

const searchQuery = ref('')

const handleSearch = () => {
  currentPage.value = 1
  filteredData.value = tableData.value.filter(item => 
    item.model.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
}

const filteredData = computed(() => {
  let data = tableData.value
  if (searchQuery.value) {
    data = data.filter(camera => camera.model.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  if (selectedBrandId.value) {
    data = data.filter(camera => camera.brand_id === selectedBrandId.value)
  }
  if (selectedFormat.value) {
    data = data.filter(camera => camera.format === selectedFormat.value)
  }
  if (selectedMount.value) {
    data = data.filter(camera => camera.mount === selectedMount.value)
  }
  return data
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

const handleBrandFilter = () => {
  currentPage.value = 1
}

const handleFormatFilter = () => {
  currentPage.value = 1
}

const handleMountFilter = () => {
  currentPage.value = 1
}

// 对话框相关
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addForm = ref({ ...INITIAL_ADD_FORM })
const editForm = ref({ ...INITIAL_ADD_FORM })
const currentEditCameraId = ref(null)

// 表单验证规则
const formRules = {
  model: [
    { required: true, message: '请输入相机型号', trigger: 'blur' },
    { min: 2, max: 50, message: '相机型号长度在2到50个字符之间', trigger: 'blur' }
  ],
  brand_id: [
    { required: true, message: '请输入品牌ID', trigger: 'blur' }
  ],
  format: [
    { required: true, message: '请输入格式', trigger: 'blur' }
  ],
  weight: [
    { required: true, message: '请输入重量', trigger: 'blur' }
  ],
  mount: [
    { required: true, message: '请输入卡口类型', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' }
  ],
  pixel_resolution: [
    { required: true, message: '请输入像素分辨率', trigger: 'blur' }
  ],
  release_date: [
    { required: true, message: '请选择发布日期', trigger: 'blur' },
    { type: Date, default: () => new Date() }
  ],
  image_url: [
    { required: true, message: '请输入图片URL', trigger: 'blur' }
  ]
}

// 生命周期钩子
onMounted(async () => {
  const cameras = await getCameraList();
  tableData.value = cameras.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
  brandList.value = await getBrandList()

  // 过滤掉 format 和 mount 为 null 的数据
  const validCameras = tableData.value.filter(camera => camera.format !== null && camera.mount !== null);

  formatOptions.value = [...new Set(validCameras.map(camera => camera.format))]
  mountOptions.value = [...new Set(validCameras.map(camera => camera.mount))]
})

// 添加相机
const handleAdd = () => {
  addForm.value = { ...INITIAL_ADD_FORM }
  addDialogVisible.value = true
}

const submitAdd = async () => {
  try {
    const newCamera = await createCamera(addForm.value)
    tableData.value.push(newCamera)
    addDialogVisible.value = false
  } catch (error) {
    console.error('添加相机失败:', error)
  }
}

// 编辑相机
const handleEdit = (id, row) => {
  currentEditCameraId.value = id
  editForm.value = { ...row }
  editDialogVisible.value = true
}

const submitEdit = async () => {
  try {
    const updatedCamera = await updateCamera(currentEditCameraId.value, editForm.value)
    const index = tableData.value.findIndex(camera => camera.id === currentEditCameraId.value)
    if (index !== -1) {
      tableData.value[index] = updatedCamera
    }
    editDialogVisible.value = false
  } catch (error) {
    console.error('更新相机信息失败:', error)
  }
}

// 删除相机
const handleDelete = async (id) => {
  try {
    await deleteCamera(id)
    tableData.value = tableData.value.filter(camera => camera.id !== id)
  } catch (error) {
    console.error('删除相机失败:', error)
  }
}

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}
</script>

<style scoped>
/* 去掉表格边框 */
.filter-container {
  margin-bottom: 20px;
}

.el-table {
  border: none;
  table-layout: fixed; /* 新增：固定表格布局 */
}

/* 去掉单元格边框 */
.el-table td,
.el-table th.is-leaf {
  border: none;
}

/* 图片容器样式 */
.image-container {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* 修改单元格样式 */
.el-table__cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px 0; /* 调整内边距 */
  line-height: 1.2; /* 调整行高 */
}

/* 为特定列设置最小宽度 */
.el-table__cell:nth-child(3) { /* 画幅列 */
  min-width: 80px;
}

.el-table__cell:nth-child(4) { /* 卡口列 */
  min-width: 150px;
}
</style>