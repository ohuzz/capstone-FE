import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';

function PostDetail() {
  const { postid } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  // 게시글 상세 정보 불러오기
  const fetchPost = async () => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      setPost(res.data.result);
    } catch (err) {
      console.error('게시글 조회 실패:', err);
    }
  };

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/posts/${id}/comments`);
      setComments(res.data.result || res.data);
    } catch (err) {
      console.error('댓글 목록 조회 실패:', err);
    }
  };

  // 좋아요 처리
  const handleLike = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        `/api/posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 서버에서 반환된 좋아요 수로 업데이트
      setPost(prev => ({ ...prev, likes: res.data.likes }));
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        `/api/posts/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 낙관적 업데이트
      const saved = res.data.result || res.data;
      setComments(prev => [...prev, saved]);
      setNewComment('');
    } catch (err) {
      console.error('댓글 등록 실패:', err);
    }
  };

  if (!post) return <div className="loading">로딩 중...</div>;

  return (
    <div className="post-detail">
      {/* 이미지 렌더링 */}
      <div className="post-images">
        {post.images?.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`post-${id}-img-${idx}`}
            className="post-img"
          />
        ))}
      </div>

      {/* 제목 · 날짜 */}
      <div className="post-header">
        <h2 className="post-title">{post.title}</h2>
        <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
      </div>

      {/* 메타정보 */}
      <div className="post-meta">
        <div className="meta-box category">카테고리: {post.category}</div>
        <div className="meta-box gender">성별: {post.gender}</div>
        <div className="meta-box period">수술경과: {post.surgeryProgress}</div>
        <div className="meta-box amount">이식량: {post.transplantCount}모</div>
        <div className="meta-box rating">
          만족도:&nbsp;
          {[1,2,3,4,5].map(n => (
            <span key={n} className={n <= post.satisfactionScore ? 'star on' : 'star'}>★</span>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div className="post-content">
        {post.content.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      {/* 좋아요 버튼 */}
      <div className="post-actions">
        <button className="like-btn" onClick={handleLike}>
          ❤️ 좋아요 {post.likes}
        </button>
      </div>

      {/* 댓글 섹션 */}
      <div className="comments-section">
        <h3>댓글 ({comments.length})</h3>
        <ul className="comments-list">
          {comments.map(c => (
            <li key={c.commentId} className="comment-item">
              <div className="avatar">{c.username.charAt(0)}</div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-user">{c.username}</span>
                  <span className="comment-date">{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <p className="comment-content">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="댓글을 입력해 주세요"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button type="submit">등록</button>
        </form>
      </div>
    </div>
  );
}

export default PostDetail;
