import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { baseAPI } from '../apis/instance';
import './PostDetail.css';

// 한글 매핑
const GENDER_MAP = { MALE: '남성', FEMALE: '여성' };

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');

  // 상세 + 댓글 한 번에 불러오기
  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await baseAPI.get(`/community/posts/${postId}`);
        setPost(res.data.result);
      } catch (err) {
        console.error('상세 조회 실패', err);
      }
    }
    fetchDetail();
  }, [postId]);

  // 좋아요 등록
  const handleLike = async () => {
    try {
      const res = await baseAPI.post(
          `/community/posts/${postId}/likes`,
          {}
      );
      setPost(prev => ({
        ...prev,
        likeCount: res.data.result.likeCount
      }));
    } catch (err) {
      console.error('좋아요 실패', err);
    }
  };

  // 댓글 등록
  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await baseAPI.post(
          `/community/posts/${postId}/comments`, // 엔드포인트가 다르면 수정
          { content: newComment }
      );
      setPost(prev => ({
        ...prev,
        comments: [...(prev.comments || []), res.data.result]
      }));
      setNewComment('');
    } catch (err) {
      console.error('댓글 등록 실패', err);
    }
  };

  if (!post) return <div className="post-detail">로딩 중…</div>;

  return (
      <div className="post-detail">
        {/* 제목 · 작성일 */}
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
          <span className="post-date">
          {new Date(post.createdDate || post.createdAt).toLocaleString()}
        </span>
        </div>

        {/* 메타 정보 */}
        <div className="post-meta">
          <div className="meta-box">카테고리: {post.category}</div>
          <div className="meta-box">성별: {GENDER_MAP[post.gender] || '-'}</div>
          <div className="meta-box">경과: {post.sergeryProgress || post.surgeryProgress}</div>
          <div className="meta-box">이식량: {post.transplantAmount || post.transplantCount}모</div>
          <div className="meta-box rating">
            만족도:&nbsp;
            {[1,2,3,4,5].map(n => (
                <span key={n} className={`star ${n <= (post.satisfactionLevel || post.satisfactionScore) ? 'on' : ''}`}>
              ★
            </span>
            ))}
          </div>
        </div>

        {/* 본문 + 이미지 */}
        <div className="post-content">
          {post.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
          ))}
          {/* backend returns fileNames[] */}
          {(post.fileNames || []).map((filename, i) => (
              <img
                  key={i}
                  src={`${process.env.REACT_APP_BASE_URL}/uploads/${filename}`}
                  alt={filename}
                  className="post-img"
              />
          ))}
        </div>

        {/* 좋아요 버튼 */}
        <div className="post-actions">
          <button className="like-btn" onClick={handleLike}>
            ❤️ 좋아요 {post.likeCount}
          </button>
        </div>

        {/* 해시태그 */}
        <div className="hashtags">
          {(post.hashtags || []).map(tag => (
              <span key={tag} className="hashtag">
            #{tag}
          </span>
          ))}
        </div>

        {/* 댓글 섹션 */}
        <div className="comments-section">
          <h3>댓글 ({post.comments?.length || 0})</h3>
          <ul className="comments-list">
            {(post.comments || []).map(c => (
                <li key={c.commentId || c.id} className="comment-item">
                  <div className="avatar">{c.username.charAt(0)}</div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-user">{c.username}</span>
                      <span className="comment-date">
                    {new Date(c.createdDate || c.createdAt).toLocaleString()}
                  </span>
                    </div>
                    <p className="comment-content">{c.content}</p>
                  </div>
                </li>
            ))}
          </ul>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
                type="text"
                placeholder="댓글을 입력하세요"
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
