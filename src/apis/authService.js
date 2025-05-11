import { baseAPI, setJwtToken } from './instance';

// 로그인 함수
export const login = async credentials => {
  try {
    // 1) 로그인 요청
    const response = await baseAPI.post('/login', credentials);

    // 2) 헤더에 내려오는 토큰(혹은 바디에서 내려오는 토큰)을 가져옵니다.
    let rawToken = response.headers['authorization'];
    if (!rawToken && response.data.accessToken) {
      rawToken = response.data.accessToken;
    }

    if (!rawToken) {
      console.warn('로그인 응답에 토큰이 없습니다.');
      return response.data;
    }

    // 3) "Bearer " prefix가 없으면 붙여주기
    const token = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

    // 4) 인터셉터용, 로컬스토리지용으로 한 번만 저장
    setJwtToken(token);
    localStorage.setItem('accessToken', token); // 로컬스토리지에 저장

    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};
