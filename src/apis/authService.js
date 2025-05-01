import { baseAPI, setJwtToken } from './instance.js'; // baseAPI, setJwtToken 함수가 정의된 파일을 불러옵니다.

// 로그인 함수: 사용자 인증 정보를 보내고, 성공 시 JWT 토큰을 저장합니다.
export const login = async credentials => {
    try {
        const response = await baseAPI.post('/auth/login', credentials);
        // 1) 헤더에서 토큰 꺼내기
        const token = headerToken.startsWith('Bearer ')
          ? headerToken
          : `Bearer ${headerToken}`;
          setJwtToken(token);
          localStorage.setItem('accessToken', token);


        if (headerToken) {
            // 2) instance.js 에 토큰 저장 (인터셉터용)
            setJwtToken(headerToken);
            // 3) localStorage에도 보관 (새로고침해도 유지)
            localStorage.setItem('accessToken', headerToken);
          } else {
            console.warn('로그인 응답에 Authorization 헤더가 없습니다.');
          }
      
          return response.data;
        } catch (error) {
          console.error('로그인 실패:', error);
          throw error;
        }
      };
      
      // 회원가입 함수: 사용자 데이터를 보내어 등록 요청을 수행합니다.
      export const register = async userData => {
        try {
          const response = await baseAPI.post('/user/register', userData);
          return response.data;
        } catch (error) {
          console.error('회원가입 실패:', error);
          throw error;
        }
      };