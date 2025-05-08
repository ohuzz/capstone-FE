// src/apis/authService.js
import { baseAPI, setJwtToken } from './instance';

// 로그인 함수
export const login = async credentials => {
  try {
    // 1) 로그인 요청
    const response = await baseAPI.post('/auth/login', credentials);
    
    // 2) 헤더에 내려오는 토큰(혹은 바디에서 내려오는 토큰)을 가져옵니다.
    //    백엔드가 Authorization 헤더에 실어준다면:
    let rawToken = response.headers['authorization'];
    //    만약 바디로 실어준다면 예를 들어:
    if (!rawToken && response.data.accessToken) {
      rawToken = response.data.accessToken;
    }

    if (!rawToken) {
      console.warn('로그인 응답에 토큰이 없습니다.');
      return response.data;
    }

    // 3) "Bearer " prefix가 없으면 붙여주기
    const token = rawToken.startsWith('Bearer ')
      ? rawToken
      : `Bearer ${rawToken}`;

    // 4) 인터셉터용, 로컬스토리지용으로 한 번만 저장
    setJwtToken(token);
    localStorage.setItem('accessToken', token);

    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

// 회원가입 함수
export const register = async userData => {
  try {
    const response = await baseAPI.post('/user/register', userData);
    return response.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};
