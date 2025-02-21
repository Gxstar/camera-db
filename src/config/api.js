const API_BASE_URL = 'http://127.0.0.1:8000';

const API_CONFIG = {
  // 用户相关 API
  USER_LOGIN: `${API_BASE_URL}/api/login`,
  USER_REGISTER: `${API_BASE_URL}/api/register`,
  // 商品相关 API
  PRODUCT_LIST: `${API_BASE_URL}/api/products`,
  PRODUCT_DETAIL: (id) => `${API_BASE_URL}/api/products/${id}`,
  // 用户相关 API
  USER_LOGIN: `${API_BASE_URL}/login`,
};

export default API_CONFIG;
