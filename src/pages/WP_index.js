// src/pages/WP_index.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
// MK
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
// layout
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import routes from "routes";
import footerRoutes from "footer.routes";
import bgImage from "../assets/images/bg-about-us.jpg";
// api
import { baseAPI } from "apis/instance";  // src/apis/instance.js 에 위치한 가정

export default function WP_index() {
  const navigate = useNavigate();

  // --- form state & handlers ---
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // 파일 첨부 → 프리뷰
  const handleFileChange = e => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };
  useEffect(() => {
    return () => previews.forEach(u => URL.revokeObjectURL(u));
  }, [previews]);

  // 태그 입력
  const handleTagKeyDown = e => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      const v = tagInput.trim();
      if (!v) return;
      setTags(t => [...t, v]);
      setTagInput("");
    }
  };
  const removeTag = i => setTags(t => t.filter((_, idx) => idx !== i));

  // 별점
  const handleStarClick = v => setRating(v);

  // 제출
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    files.forEach(f => form.append("imageFiles", f));
    form.append("title", title);
    form.append("content", content);
    form.append("category", category);
    form.append("gender", gender);
    form.append("surgeryProgress", period);
    form.append("transplantCount", amount);
    form.append("satisfactionScore", rating);
    tags.forEach(t => form.append("hashtags", t));

    try {
      await baseAPI.post("/v2/community/posts", form, {
        requiresAuth: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/community");
    } catch {
      alert("작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} transparent light />

      {/* Banner */}
      <MKBox
        minHeight="50vh"
        width="100%"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(rgba(gradients.dark.main, 0.6), rgba(gradients.dark.state, 0.6))}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Container>
          <Grid container justifyContent="center" alignItems="center" flexDirection="column" sx={{ textAlign: "center" }}>
            <MKTypography variant="h1" color="white">
              Community
            </MKTypography>
            <MKTypography variant="body1" color="white" opacity={0.8} mt={1} mb={3}>
              서로의 정보를 공유하고 원하는 정보를 찾아보세요!
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>

      {/* 여기에 글쓰기 폼만 있는 단일 페이지 */}
      <MKBox component="section" pt={6} pb={6}>
        <Container>
          <Grid container justifyContent="center">
            <Grid item xs={12} lg={8} md={10}>
              <Card
                sx={{
                  p: 8,
                  mx: { xs: 2, lg: 3 },
                  mt: -8,
                  mb: 4,
                  boxShadow: ({ boxShadows: { xxl } }) => xxl,
                }}
              >
                <MKTypography variant="h4" gutterBottom>
                  새 게시글 작성
                </MKTypography>

                <MKBox component="form" onSubmit={handleSubmit}>
                  {/* 파일첨부 */}
                  <MKBox display="flex" alignItems="center" gap={2} mb={2}>
                    <MKButton variant="outlined" component="label">
                      파일첨부
                      <input type="file" hidden multiple onChange={handleFileChange} />
                    </MKButton>
                    <MKTypography variant="body2">{files.length}개 선택됨</MKTypography>
                  </MKBox>

                  {/* 이미지 미리보기 */}
                  <MKBox display="flex" flexWrap="wrap" gap={2} mb={3}>
                    {previews.map((src, i) => (
                      <MKBox key={i} component="img" src={src} alt="preview" sx={{ width: 80, borderRadius: 1 }} />
                    ))}
                  </MKBox>

                  {/* 필터 */}
                  <MKBox display="flex" flexWrap="wrap" gap={2} mb={3}>
                    <MKInput select label="카테고리" value={category} onChange={e => setCategory(e.target.value)}>
                      <option value="">선택</option>
                      <option value="ALOPECIA_AREATA">원형탈모</option>
                      <option value="HAIR_TRANSPLANT">모발이식</option>
                      <option value="HAIR_MEDICINE">탈모약</option>
                      <option value="HOSPITAL_QUESTION">병원질문</option>
                      <option value="FREE_TALK">자유수다</option>
                    </MKInput>
                    <MKInput select label="성별" value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="">선택</option>
                      <option value="MALE">남성</option>
                      <option value="FEMALE">여성</option>
                    </MKInput>
                    <MKInput select label="수술경과" value={period} onChange={e => setPeriod(e.target.value)}>
                      <option value="">선택</option>
                      <option value="ONE_WEEK">1주</option>
                      <option value="TWO_WEEKS">2주</option>
                      <option value="ONE_MONTH">1달</option>
                      <option value="THREE_MONTHS">3달</option>
                      <option value="SIX_MONTHS">6달</option>
                      <option value="ONE_YEAR">1년</option>
                    </MKInput>
                    <MKInput
                      type="number"
                      label="모발이식량"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </MKBox>

                  {/* 별점 */}
                  <MKBox mb={3}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <Icon
                        key={n}
                        sx={{ cursor: "pointer", fontSize: "1.5rem", mr: 1 }}
                        onClick={() => handleStarClick(n)}
                      >
                        {n <= rating ? "star" : "star_border"}
                      </Icon>
                    ))}
                  </MKBox>

                  {/* 제목/내용 */}
                  <MKBox mb={2}>
                    <MKInput label="제목" fullWidth value={title} onChange={e => setTitle(e.target.value)} />
                  </MKBox>
                  <MKBox mb={3}>
                    <MKInput
                      type="textarea"
                      label="내용"
                      fullWidth
                      rows={6}
                      multiline
                      value={content}
                      onChange={e => setContent(e.target.value)}
                    />
                  </MKBox>

                  {/* 태그 */}
                  <MKBox mb={3}>
                    <MKInput
                      label="#태그 입력 후 Enter"
                      fullWidth
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <MKBox display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {tags.map((t, i) => (
                        <MKBox
                          key={i}
                          display="flex"
                          alignItems="center"
                          px={1}
                          py={0.5}
                          bgColor="grey"
                          borderRadius="lg"
                        >
                          <MKTypography variant="button">{t}</MKTypography>
                          <MKButton size="small" variant="text" onClick={() => removeTag(i)}>
                            ×
                          </MKButton>
                        </MKBox>
                      ))}
                    </MKBox>
                  </MKBox>

                  {/* 제출 */}
                  <MKBox display="flex" justifyContent="flex-end">
                    <MKButton type="submit" variant="gradient" color="info" disabled={loading}>
                      {loading ? "등록 중…" : "등록"}
                    </MKButton>
                  </MKBox>
                </MKBox>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MKBox>

      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}