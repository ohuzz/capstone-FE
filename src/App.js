import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Doctor from './pages/Doctor';
import Hospital from './pages/Hospital';
import Community from './pages/Community';
import Notice from './pages/Notice';
import FAQ from './pages/FAQ';
import Mypage from './pages/Mypage';
import Login from './pages/Login';
import WritePost from './pages/WritePost';
import PostDetail from './pages/PostDetail';
import './App.css';

// import setJwtToken from api/instance (axios 설정 파일)
import { setJwtToken } from './apis/instance';

function App() {
  // 앱이 로드될 때 로컬 스토리지에서 토큰을 읽어오는 useEffect
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // 토큰이 존재하면 Axios 기본 헤더에 설정
      setJwtToken(token);
    }
  }, []);

  return (
      <Router>
        <div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/doctor" element={<Doctor />} />
              <Route path="/hospital" element={<Hospital />} />
              <Route path="/community" element={<Community />} />
              <Route path="/notice" element={<Notice />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/writepost" element={<WritePost />} />
              <Route path="/posts/:postId" element={<PostDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;
