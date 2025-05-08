// src/apis/instance.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

// 1) Axios 인스턴스 생성
export const baseAPI = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 쿠키가 필요한 경우
});

// 2) 토큰을 저장할 로컬 변수와 getter/setter
let jwtToken = '';

/** 토큰을 설정합니다 */
export const setJwtToken = token => {
  jwtToken = token;
};

/** 현재 저장된 토큰을 반환합니다 */
export const getJwtToken = () => jwtToken;

// 3) 요청 인터셉터: 토큰이 있으면 모든 요청(또는 requiresAuth 요청)에 헤더에 추가
baseAPI.interceptors.request.use(config => {
  // 만약 requiresAuth 플래그를 사용하지 않으려면, 
  // 항상 달고 싶다면 if 없이 아래 두 줄만 남기시면 됩니다!
  const requiresAuth = config.requiresAuth ?? true;
  if (requiresAuth && jwtToken) {
    config.headers['Authorization'] = `Bearer ${jwtToken}`;
  }
  return config;
}, error => Promise.reject(error));

// 4) (옵션) 토큰 검증 / 갱신 / 로그아웃 유틸도 그대로 두셔도 OK
export const checkJwtToken = async () => {
  try {
    const { status } = await baseAPI.get('/auth/verify-token');
    return status === 200;
  } catch {
    return false;
  }
};

export const refreshJwtToken = async () => {
  const res = await baseAPI.get('/auth/refresh-token');
  jwtToken = res.data.jwtToken;
  return jwtToken;
};

export const logout = async () => {
  await baseAPI.post('/auth/logout');
  jwtToken = '';
};
