import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Community.css';

function Community() {
  // 필터 & 페이징 & 정렬 상태
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');  
  const [gender, setGender] = useState('');  
  const [transplantCount, setTransplantCount] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('createdDate.desc');

  // 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const params = {
        category: category || undefined,
        gender: gender || undefined,
        page,
        order: sort
      };
      if (transplantCount) {
        const base = Number(transplantCount);
        params.goe = base;
        params.loe = base + 1000;
      }
      const res = await axios.get('/api/posts', { params });
      const data = res.data.result?.content || [];
      setPosts(data);
      setTotalPages(res.data.result?.totalPages ?? 1);
    } catch (err) {
      console.error('게시글 목록 불러오기 실패', err);
    }
  };

  // 마운트 및 필터/페이징/정렬 변경 시 다시 호출
  useEffect(() => {
    setPage(0);
    fetchPosts();
  }, [category, gender, transplantCount, sort]);

  // 검색 버튼 클릭
  const handleSearch = () => {
    setPage(0);
  };

  return (
    <div className="community-page">
      {/* 필터 바 */}
      <div className="search-wrapper">
        <div className="filter-bar">
          <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">카테고리</option>
          <option value="ALOPECIA_AREATA">원형탈모</option>
          <option value="HAIR_TRANSPLANT">모발이식</option>
          <option value="HAIR_MEDICINE">탈모약</option>
          <option value="HOSPITAL_QUESTION">병원질문</option>
          <option value="FREE_TALK">자유수다</option>
        </select>
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">성별</option>
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </select>
        <select value={transplantCount} onChange={e => setTransplantCount(e.target.value)}>
          <option value="">모발이식량</option>
          <option value="1000">1000모</option>
          <option value="2000">2000모</option>
          <option value="3000">3000모</option>
          <option value="4000">4000모</option>
        </select>
        <button className="search-btn" onClick={handleSearch}>검색</button>
        </div>    
      </div>

      {/* 정렬 드롭다운 (추천순) */}
      <div className="sort-bar">
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="createdDate.desc">최신순</option>
          <option value="likesCount.desc">추천순</option>
        </select>
      </div>

      {/* 게시글 표 */}
      <table className="posts-table">
        <thead>
          <tr>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>좋아요</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr><td colSpan="5">게시글이 없습니다.</td></tr>
          ) : (
            posts.map(post => (
              <tr key={post.postId}>
                <td>{post.category}</td>
                <td>
                  <Link to={`/posts/${post.postId}`}>{post.title} ({post.commentCount})</Link>
                </td>
                <td>{post.username}</td>
                <td>{new Date(post.date).toLocaleDateString()}</td>
                <td>{post.likes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이징 네비게이터 */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>&laquo;</button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={i === page ? 'active' : ''}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={page + 1 === totalPages} onClick={() => setPage(p => p + 1)}>&raquo;</button>
      </div>

      {/* 글쓰기 버튼 */}
      <div className="write-post-btn">
        <Link to="/writepost">
          <button>글쓰기</button>
        </Link>
      </div>
    </div>
  );
}

export default Community;
