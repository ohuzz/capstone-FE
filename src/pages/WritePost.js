import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseAPI } from '../apis/instance';
import './WritePost.css';

function WritePost() {
  // 1) form 전체 state (파일 여러 개)
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [period, setPeriod] = useState('');  
  const [amount, setAmount] = useState(''); 
  const [rating, setRating] = useState(0); 
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]); 

  // 파일 첨부 프리뷰
  const handleFileChange = e => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map(file =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  };

  // 📌 컴포넌트 언마운트 시 혹은 파일 재선택 시 URL 해제
  useEffect(() => {
        return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
      };
    }, [previews]);

  // 엔터치면 태그 추가
  const handleTagKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    if (e.nativeEvent.isComposing) return;

    e.preventDefault();
    const val = tagInput.trim();
    if (!val) return;

    setTags(prev => [...prev, val]);
    setTagInput('');
  };

  const removeTag = idx => setTags(prev => prev.filter((_, i) => i !== idx));

  // 별점 클릭
  const handleStarClick = value => setRating(value);

  // 폼 제출
  const handleSubmit = async e => {
    e.preventDefault();

  // multipart/form-data 로 파일과 데이터를 함께 전송
  const formData = new FormData();
    files.forEach(file => {
      formData.append('imageFiles', file); 
    });
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('gender', gender);
    formData.append('surgeryProgress', period);
    formData.append('transplantCount', amount);
    formData.append('satisfactionScore', rating);
    tags.forEach(tag => formData.append('hashtags', tag));

    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    try {
      const response = await baseAPI.post(
        '/v2/community/posts',
        formData,
      //   { requiresAuth: true,
      //     // headers: {
      //     // 'Content-Type': 'multipart/form-data'
      //     // }
      //   }                
      // // ② requiresAuth 플래그만 추가
      );
      console.log('게시글 작성 성공:', response.data);
      navigate('/community');              
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('글 쓰기에 실패했습니다. 로그인 상태를 확인해주세요.');
    }
  };

  return (
    <form className="write-post" onSubmit={handleSubmit}>
      {/* 1. 파일 첨부 (multiple) */}
      <div className="file-upload">
        <label className="btn-file">
          파일첨부
          <input type="file" name="imageFiles" multiple onChange={handleFileChange} />
        </label>
        <div className="file-names">
          {files.length > 0 ? (
            files.map((f, i) => (
              <span key={i} className="file-name">{f.name}</span>
            ))
          ) : (
            <span className="file-name">첨부된 파일 없음</span>
          )}
        </div>
      </div>

            {/* 2. 선택한 이미지 미리보기 */}
            {previews.length > 0 && (
        <div className="image-previews">
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`preview-${i}`}
              className="preview-img"
            />
          ))}
        </div>
      )}

      {/* 2. 필터 선택 바 */}
      <div className="filters">
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
        <select value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="">수술경과</option>
          <option value="ONE_WEEK">1주</option>
          <option value="TWO_WEEKS">2주</option>
          <option value="ONE_MONTH">1달</option>
          <option value="THREE_MONTHS">3달</option>
          <option value="SIX_MONTHS">6달</option>
          <option value="ONE_YEAR">1년</option>
        </select>
        <input
          type="number"
          placeholder="모발이식량"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <div className="rating">
          {[1,2,3,4,5].map(n => (
            <span
              key={n}
              className={n <= rating ? 'star on' : 'star'}
              onClick={() => handleStarClick(n)}
            >★</span>
          ))}
        </div>
      </div>

      {/* 3. 제목 입력 */}
      <input
        className="title-input"
        type="text"
        placeholder="제목을 입력해 주세요"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* 4. 내용 입력 */}
      <textarea
        className="content-input"
        placeholder="내용을 입력해 주세요"
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      {/* 5. 태그 입력 */}
      <div className="tags-input">
        <input
          type="text"
          placeholder="#태그를 입력해주세요 (엔터하면 자동생성)"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />
        <div className="tags-list">
          {tags.map((t, i) => (
            <span key={i} className="tag">
              {t} <button type="button" onClick={() => removeTag(i)}>×</button>
            </span>
          ))}
        </div>
      </div>

      {/* 6. 작성 완료 버튼 */}
      <button className="submit-btn" type="submit">작성완료</button>
    </form>
  );
}

export default WritePost;
