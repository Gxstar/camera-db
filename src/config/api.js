const API_BASE_URL = 'http://127.0.0.1:8000';

const API_USERS_URL = `${API_BASE_URL}/users`;
const API_BRANDS_URL = `${API_BASE_URL}/brands`;
const API_CAMERAS_URL = `${API_BASE_URL}/cameras`;
const API_LENSES_URL = `${API_BASE_URL}/lenses`;

const API_CONFIG = {
  // 用户相关 API
  USER_LOGIN: `${API_USERS_URL}/token`,
  USER_REGISTER: `${API_USERS_URL}/register`,
  USER_LIST: `${API_USERS_URL}/`,
  USER_DETAIL: (id) => `${API_USERS_URL}/${id}`,
  // 品牌相关 API
  BRAND_LIST: `${API_BRANDS_URL}/`,
  BRAND_DETAIL: (id) => `${API_BRANDS_URL}/${id}`,
  // 相机相关 API
  CAMERA_LIST: `${API_CAMERAS_URL}/`,
  CAMERA_DETAIL: (id) => `${API_CAMERAS_URL}/${id}`,
  // 镜头相关 API
  LENSE_LIST: `${API_LENSES_URL}/`,
  LENSE_DETAIL: (id) => `${API_LENSES_URL}/${id}`,
};

export default API_CONFIG;
