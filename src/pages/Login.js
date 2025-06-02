import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../apis/authService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await login({ username, password });
      // 로그인 성공 후
      console.log('로그인 성공, 받은 헤더 토큰:', localStorage.getItem('accessToken'));
      navigate('/community');
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="아이디"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button type="submit">로그인</button>
    </form>
  );
}
export default Login;
