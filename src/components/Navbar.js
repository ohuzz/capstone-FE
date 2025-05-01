// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

function Navbar() {
  return (
    <nav>
      <div className='header'>
          <Link to='/mypage' className='oval2'>마이페이지</Link>
          <Link to='/login' className='oval2'>로그인</Link>
      </div>
      <div className='footer'>
        <Link to='/home' className='oval1'>MODAC</Link>
        <Link to='/doctor' className='oval3'>닥터 찾기</Link>
        <Link to='/hospital' className='oval3'>병원 찾기</Link>
        <Link to='/community' className='oval3'>커뮤니티</Link>
        <Link to='/notice' className='oval3'>공지사항</Link>
        <Link to='/faq' className='oval3'>FAQ</Link>
      </div>
    </nav>
  );
}

export default Navbar;
