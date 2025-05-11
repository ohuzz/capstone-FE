import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8080';

// 1) Axios 인스턴스 생성
export const baseAPI = axios.create({
    baseURL: `${baseURL}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// 2) 메모리 + localStorage 기반 토큰 관리
const STORAGE_KEY = 'accessToken';

/** 토큰 설정: 메모리, localStorage, axios 기본 헤더에 모두 저장 */
export const setJwtToken = token => {
    const bearer = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    jwtToken = bearer; // 메모리에 토큰 저장
    localStorage.setItem(STORAGE_KEY, bearer); // 로컬스토리지에 저장
    baseAPI.defaults.headers.common['Authorization'] = bearer; // axios 헤더에 토큰 추가
};

/** 토큰 반환: 메모리 우선, 없으면 localStorage에서 읽기 */
export const getJwtToken = () => {
    return jwtToken || localStorage.getItem(STORAGE_KEY) || '';
};

// 3) 초기 로드 시 localStorage 에 있는 토큰을 메모리와 axios 헤더에 복원
let jwtToken = localStorage.getItem(STORAGE_KEY) || '';
if (jwtToken) {
    baseAPI.defaults.headers.common['Authorization'] = jwtToken;
}

// 4) 요청 인터셉터: 매 요청마다 최신 토큰을 헤더에 붙임
baseAPI.interceptors.request.use(config => {
    const token = getJwtToken();  // 메모리 또는 로컬스토리지에서 토큰 가져오기
    if (token) {
        config.headers['Authorization'] = token;  // 헤더에 Authorization 추가
    }
    return config;
}, error => Promise.reject(error));

// 5) (선택) 토큰 검증/갱신/로그아웃 유틸
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
    setJwtToken(res.data.jwtToken);
    return getJwtToken();
};

export const logout = async () => {
    await baseAPI.post('/auth/logout');
    // 메모리·저장소·헤더 모두 초기화
    jwtToken = '';
    localStorage.removeItem(STORAGE_KEY);
    delete baseAPI.defaults.headers.common['Authorization'];
};
